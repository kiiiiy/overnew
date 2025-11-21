#recommend/views.py

from django.http import JsonResponse
from django.views import View
from django.db.models import Count, OuterRef, Subquery, Exists
from django.shortcuts import get_object_or_404
from .models import User, NewsCategory, UserNews, Following, Article, Comment, Scrap
from django.db.models import F # 필드 참조용
import random

class RecommendUserView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': '로그인이 필요합니다.'}, status=401)

        current_user = request.user
        rec_type = request.GET.get('type')
        topic_name = request.GET.get('topic') 
        
        # ... (파라미터 유효성 검사 및 target_category 조회 로직)
        topic_map = {
            'politics': '정치', 'economy': '경제', 'society': '사회',
            'culture': '생활/문화', 'it': 'IT/과학', 'world': '세계'
        }
        db_category_name = topic_map.get(topic_name)
        if not db_category_name:
            return JsonResponse({'error': '유효하지 않은 topic입니다.'}, status=400)

        try:
            target_category = NewsCategory.objects.get(news_category=db_category_name)
        except NewsCategory.DoesNotExist:
            return JsonResponse({'error': '해당 카테고리가 DB에 존재하지 않습니다.'}, status=404)

        recommend_users = User.objects.none()

        # -----------------------------------------------------
        # 1. 추천 대상 사용자 목록 쿼리 (2개 이상 일치 로직 유지)
        # -----------------------------------------------------
        if rec_type == 'similar':
            # 1. 현재 사용자가 선택한 모든 카테고리 ID를 가져옴
            current_user_categories = UserNews.objects.filter(
                user=current_user
            ).values_list('nc_id', flat=True)
            
            # 2. 2개 이상 일치하는 사용자 ID를 조회
            similar_user_ids = UserNews.objects.filter(
                nc_id__in=current_user_categories
            ).exclude(
                user=current_user
            ).values('user_id').annotate(
                match_count=Count('nc_id')
            ).filter(
                match_count__gte=2
            ).order_by('-match_count').values_list('user_id', flat=True)

            recommend_users = User.objects.filter(id__in=similar_user_ids)

        elif rec_type == 'opposite':
            # 반대 관심사: 대상 카테고리를 선택하지 않은 사용자
            users_with_target_topic = UserNews.objects.filter(
                nc=target_category
            ).values('user_id')
            
            recommend_users = User.objects.exclude(
                id__in=users_with_target_topic
            ).exclude(
                id=current_user.id
            ).distinct()

        # 2. 팔로우 상태 주입 및 최종 사용자 목록
        is_followed_subquery = Following.objects.filter(
            user=current_user,
            user2=OuterRef('id')
        )
        
        # 무작위로 10명 선택 (match_count 정렬은 similar에서 이미 반영됨)
        final_users = recommend_users.annotate(
            is_followed=Exists(is_followed_subquery)
        )[:10] 

        # -----------------------------------------------------
        # 3. 최종 JSON 응답 생성 (기사 조회 로직 수정)
        # -----------------------------------------------------
        data = []
        for user in final_users:
            # 3-1. 해당 사용자가 현재 topic(target_category)에 대해 스크랩한 최신 기사 2개 조회
            # Scrap -> Article -> NewsCategory 관계를 통해 필터링
            
            # Scrap 테이블을 기준으로, 추천 사용자(user)가 스크랩했고,
            # 그 기사(article)의 카테고리가 target_category인 레코드를 찾음
            scrapped_articles = Scrap.objects.filter(
                user=user,
                article__nc=target_category # Article의 nc_id 필터링
            ).order_by('-article__article_id')[:2] # article_id가 높은(최신) 순으로 2개

            articles_list = []
            for scrap in scrapped_articles:
                article = scrap.article
                reaction_count = 0
                
                # 기사에 대한 반응 카운트
                if rec_type == 'similar':
                    # 유사: 해당 기사에 대한 스크랩 수 (reaction에 대응)
                    reaction_count = Scrap.objects.filter(article=article).count()
                elif rec_type == 'opposite':
                    # 반대: 해당 기사에 대한 댓글 수 (comments에 대응)
                    reaction_count = Comment.objects.filter(article=article).count()

                articles_list.append({
                    'id': str(article.article_id),
                    'image': None, # Article 모델에 image 필드가 없으므로, 프론트엔드에서 처리 필요
                    'title': article.title,
                    'source': 'DB에 소스 필드가 없으므로 임의 지정', 
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
            topic_name: data
        }

        return JsonResponse(response_data)