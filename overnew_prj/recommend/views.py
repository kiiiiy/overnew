# recommend/views.py (최종 로직 변경: 성향 기반 반대 사용자 추천 + 중립/미정 성향 포함)

from django.http import JsonResponse
from django.views import View
from django.db.models import Count, OuterRef, Subquery, Exists
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
# 핵심 모델 임포트
from account.models import NewsCategory, UserNews as AccountUserNews 
from archive.models import Article

User = get_user_model()

# ------------------------------------------------------------------
# 🌟🌟🌟 모델 임포트와 플래그 설정 (이전 단계 오류 해결 유지) 🌟🌟🌟
try:
    from discussion.models import Scrap, Comment, Following 
    FOLLOWING_MODEL_AVAILABLE = True
except ImportError:
    class Scrap: pass
    class Comment: pass
    FOLLOWING_MODEL_AVAILABLE = False 
# ------------------------------------------------------------------


def get_opposite_stance(stance: str) -> list[str]:
    """주어진 성향의 반대 성향 목록을 반환합니다. (중립/미정 포함)"""
    # 🌟🌟🌟 수정된 로직: 모든 성향이 서로 다른 성향을 반대 성향으로 간주 🌟🌟🌟
    mapping = {
        # 진보 성향에게는 보수와 중립/미정 성향을 가진 사용자를 추천
        'progressive': ['conservative', 'neutral', 'unsure'],
        # 보수 성향에게는 진보와 중립/미정 성향을 가진 사용자를 추천
        'conservative': ['progressive', 'neutral', 'unsure'],
        # 중립 성향에게는 진보, 보수, 미정 성향을 가진 사용자를 추천
        'neutral': ['progressive', 'conservative', 'unsure'], 
        # 미정 성향에게는 진보, 보수, 중립 성향을 가진 사용자를 추천
        'unsure': ['progressive', 'conservative', 'neutral'], 
    }
    return mapping.get(stance, [])


class RecommendUserView(View):
    def get(self, request):
        # ------------------------------------------------------------------
        # [로그인 우회 치트키]
        current_user = request.user
        
        if not current_user.is_authenticated:
            try:
                current_user = User.objects.all().first()
                if not current_user:
                    return JsonResponse({'error': '로그인이 필요하며, DB에 테스트 유저가 없습니다. 회원가입을 먼저 진행해주세요.'}, status=401)
            except Exception as e:
                return JsonResponse({'error': f'테스트 유저를 가져오는 중 오류 발생: {e}'}, status=500)
        # ------------------------------------------------------------------
        
        rec_type = request.GET.get('type')
        topic_code = request.GET.get('topic') 
        
        if not topic_code:
            topic_code = 'politics' 
        
        # 🌟🌟🌟 성향 기반 반대 사용자 추천 로직 🌟🌟🌟
        
        current_user_stance = current_user.stance
        opposite_stances = get_opposite_stance(current_user_stance)
        
        if not opposite_stances:
            # 이 로직은 위에서 수정했기 때문에 'unsure'나 'neutral'에서도 다른 성향이 나옵니다.
            return JsonResponse({'message': '현재 성향으로는 추천할 반대 성향 사용자를 찾을 수 없습니다.'}, status=200)

        # 1. 반대 성향 사용자만 필터링
        recommend_users = User.objects.filter(
            stance__in=opposite_stances
        ).exclude(
            pk=current_user.pk
        )
        
        if not recommend_users.exists():
            return JsonResponse({'message': '추천 대상인 반대 성향 사용자가 없습니다.'}, status=200)

        # 2. Topic Category 설정
        try:
            target_category = NewsCategory.objects.get(code=topic_code)
        except NewsCategory.DoesNotExist:
            return JsonResponse({'error': f'해당 카테고리({topic_code})가 DB에 존재하지 않습니다.'}, status=404)
        
        # -----------------------------------------------------
        # 3. 팔로우 상태 주입 및 최종 사용자 목록 (무작위 10명)
        if FOLLOWING_MODEL_AVAILABLE:
            is_followed_subquery = Following.objects.filter(
                user=current_user,
                user2=OuterRef('id')
            )
            final_users = recommend_users.annotate(
                is_followed=Exists(is_followed_subquery)
            ).order_by('?')[:10]
        else:
            final_users = recommend_users.order_by('?')[:10]
        # -----------------------------------------------------

        # 4. 최종 JSON 응답 생성
        data = []
        for user in final_users:
            
            is_followed_status = getattr(user, 'is_followed', False) 

            # 4-1. 해당 사용자가 현재 topic에 대해 스크랩한 최신 기사 2개 조회
            try:
                scrapped_articles = Scrap.objects.filter(
                    user=user,
                    news__nc=target_category 
                ).order_by('-news__article_id')[:2]
            except Exception:
                scrapped_articles = []

            articles_list = []
            
            for scrap in scrapped_articles:
                article = scrap.news
                reaction_count = 0
                
                # 기사에 대한 반응 카운트
                try:
                    # rec_type이 'similar'인 경우와 아닌 경우를 모두 처리
                    if rec_type == 'similar':
                        reaction_count = Scrap.objects.filter(news=article).count() 
                    else: # 'opposite' 또는 type이 명시되지 않은 경우
                        reaction_count = Comment.objects.filter(article=article).count()
                except Exception:
                    reaction_count = 0 

                articles_list.append({
                    'id': str(article.article_id),
                    'image': article.image if hasattr(article, 'image') and article.image else None,
                    'title': article.title,
                    'source': 'Media 필드 임의 지정', 
                    'reactions': str(reaction_count) if rec_type == 'similar' else None,
                    'comments': str(reaction_count) if rec_type in ['opposite', None] or rec_type != 'similar' else None,
                    'noImage': False
                })


            data.append({
                'user': user.nickname,
                'avatar': f'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text={user.nickname[0]}',
                'userId': user.username,
                'isFollowed': is_followed_status,
                'articles': articles_list,
            })

        response_data = {
            topic_code: data
        }

        return JsonResponse(response_data)