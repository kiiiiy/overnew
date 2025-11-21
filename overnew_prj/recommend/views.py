# recommend/views.py (최종 수정본 - 모델 참조 및 추천 로직 개선)

from django.http import JsonResponse
from django.views import View
from django.db.models import Count, OuterRef, Subquery, Exists
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
# 🌟 수정 1: 핵심 모델은 account 앱에서, 추천 앱 모델은 recommend.models에서 가져옵니다.
from account.models import NewsCategory, UserNews as AccountUserNews 
from archive.models import Article

User = get_user_model()


def get_opposite_stance(stance: str) -> list[str]:
    """주어진 성향의 반대 성향 목록을 반환합니다."""
    # account.User 모델에 정의된 STANCE_CHOICES 기준
    mapping = {
        'progressive': ['conservative'],
        'conservative': ['progressive'],
    }
    return mapping.get(stance, [])


class RecommendUserView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': '로그인이 필요합니다.'}, status=401)

        current_user = request.user
        rec_type = request.GET.get('type')
        topic_code = request.GET.get('topic') 
        
        # 🌟 수정 2: NewsCategory는 code 필드로 조회합니다. (topic_map 불필요)
        if not topic_code:
            return JsonResponse({'error': 'topic 코드가 필요합니다.'}, status=400)

        try:
            # NewsCategory는 code 필드에 'politics', 'economy' 등이 저장되어 있습니다.
            target_category = NewsCategory.objects.get(code=topic_code)
        except NewsCategory.DoesNotExist:
            return JsonResponse({'error': '해당 카테고리가 DB에 존재하지 않습니다.'}, status=404)

        recommend_users = User.objects.none()

        # -----------------------------------------------------
        # 1. 공통 쿼리: 2개 이상 일치하는 사용자 ID를 조회
        # -----------------------------------------------------
        
        # 1. 현재 사용자가 선택한 모든 카테고리 ID를 가져옴
        current_user_categories_ids = AccountUserNews.objects.filter(
            user=current_user
        ).values_list('category__id', flat=True) # 🌟 수정 3: category__id 사용

        if not current_user_categories_ids:
            return JsonResponse({'message': '추천을 위해 최소 2개 이상의 관심사를 선택해야 합니다.'}, status=200)

        # 2. 2개 이상 일치하는 사용자 ID를 조회
        # AccountUserNews (account.UserNews) 테이블을 사용합니다.
        base_similar_user_ids = AccountUserNews.objects.filter(
            category__id__in=current_user_categories_ids # 🌟 수정 3: category__id 사용
        ).exclude(
            user=current_user
        ).values('user').annotate(
            match_count=Count('category') # 🌟 수정 3: category 사용
        ).filter(
            match_count__gte=2
        ).order_by('-match_count').values_list('user__id', flat=True)
        
        
        # -----------------------------------------------------
        # 2. 추천 타입에 따른 최종 사용자 필터링
        # -----------------------------------------------------

        if rec_type == 'similar':
            # 유사 관심사: 2개 이상 겹치면 바로 추천 대상
            recommend_users = User.objects.filter(id__in=base_similar_user_ids)

        elif rec_type == 'opposite':
            # 🌟 수정 4: 반대 관심사 로직 (2개 이상 겹치면서, 반대 성향인 사용자)
            opposite_stances = get_opposite_stance(current_user.stance)
            
            if not opposite_stances:
                return JsonResponse({'message': '현재 성향으로는 반대 관심사 추천이 어렵습니다.'}, status=200)

            recommend_users = User.objects.filter(
                id__in=base_similar_user_ids, # 2개 이상 겹치는 사용자 목록
                stance__in=opposite_stances # 그 중 반대 성향을 가진 사용자만 필터링
            )

        else:
            return JsonResponse({'error': '유효하지 않은 type입니다. (similar 또는 opposite)'}, status=400)


        # 3. 팔로우 상태 주입 및 최종 사용자 목록
        is_followed_subquery = Following.objects.filter(
            user=current_user,
            user2=OuterRef('id')
        )
        
        # 무작위로 10명 선택
        final_users = recommend_users.annotate(
            is_followed=Exists(is_followed_subquery)
        ).order_by('?')[:10] # order_by('?')는 무작위 정렬

        # -----------------------------------------------------
        # 4. 최종 JSON 응답 생성
        # -----------------------------------------------------
        data = []
        for user in final_users:
            # 3-1. 해당 사용자가 현재 topic(target_category)에 대해 스크랩한 최신 기사 2개 조회
            
            # Scrap -> Article -> NewsCategory 관계를 통해 필터링
            scrapped_articles = Scrap.objects.filter(
                user=user,
                # 🌟 수정 5: Article 모델의 nc 필터링. target_category는 account.NewsCategory 인스턴스입니다.
                news__nc=target_category 
            ).order_by('-news__article_id')[:2] # news__article_id가 높은(최신) 순으로 2개

            articles_list = []
            for scrap in scrapped_articles:
                article = scrap.news
                reaction_count = 0
                
                # 기사에 대한 반응 카운트
                if rec_type == 'similar':
                    reaction_count = Scrap.objects.filter(news=article).count() # 해당 기사를 스크랩한 총 수
                elif rec_type == 'opposite':
                    reaction_count = Comment.objects.filter(article=article).count() # 해당 기사에 대한 댓글 총 수

                articles_list.append({
                    'id': str(article.article_id),
                    'image': article.image if hasattr(article, 'image') and article.image else None, # Article 모델에 image 필드가 있다면 사용
                    'title': article.title,
                    'source': 'DB에 Media 필드가 없으므로 임의 지정', 
                    'reactions': str(reaction_count) if rec_type == 'similar' else None,
                    'comments': str(reaction_count) if rec_type == 'opposite' else None,
                    'noImage': False
                })


            data.append({
                'user': user.nickname,
                'avatar': f'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text={user.nickname[0]}',
                'userId': user.username,
                'isFollowed': user.is_followed,
                'articles': articles_list,
            })

        response_data = {
            topic_code: data # 응답 키는 topic_code('politics')로 유지
        }

        return JsonResponse(response_data)