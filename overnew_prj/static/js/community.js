// ----- 1. 가짜 데이터 (Dummy Data) -----
const dummyCommunityData = {
    it: [
        { id: 'article-ai-food', category: 'IT/과학', source: '뉴스웍스', title: "국민 건강 위협하는 '수입식품'...AI가 자동으로 걸러낸다", image: 'https://via.placeholder.com/280x180/0D47A1/FFFFFF?text=IT뉴스', time: '12 hours left', views: '25.9k', likes: 100, comments: 205 },
        { id: 'article-sds', category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", image: 'https://via.placeholder.com/180x120/0D47A1/FFFFFF?text=차트', time: '6 days left', views: '33k', likes: 431, comments: 192 }
    ],
    politics: [
        { id: 'article-politics-1', category: '정치', source: '서울신문', title: "정치 현안 토론, 7일간 진행됩니다.", image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', time: '3 days left', views: '10.2k', likes: 50, comments: 88 }
    ],
    economy: [], society: [], culture: [], world: [], enter: [], sport: []
};

// ----- 2. localStorage에서 '좋아요', '북마크' 목록 불러오기 -----
let likedArticles = JSON.parse(localStorage.getItem('liked_articles')) || [];
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];

// ----- 3. 토론 카드 HTML 생성 -----
function createDiscussionCardHTML(cardData) {
    const isBookmarked = bookmarkedArticles.includes(cardData.id);

    const topicClassMap = { 'IT/과학': 'topic-it', '정치': 'topic-politics', '경제': 'topic-economy' };
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';

    // 🚨 [수정 1] 경로를 두 개로 분리했습니다.
    // A. 기사 보러 가는 경로 (아카이브 폴더)
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    const articleLink = `${articlePath}?id=${cardData.id}`;

    // B. 토론 참여하러 가는 경로 (디스커션 폴더)
    const discussionPath = '../../../discussion/templates/discussion/discussion-detail.html';
    const discussionLink = `${discussionPath}?id=${cardData.id}`;

    return `
    <div class="discussion-card" data-article-id="${cardData.id}">
        <span class="card-category ${categoryClass}">${cardData.category}</span>
        
        <a href="${articleLink}" class="card-title-link">
            <h3 class="card-title">${cardData.title}</h3>
        </a>
        
        <a href="${articleLink}" class="card-image-link">
            <img src="${cardData.image || 'image-placeholder.jpg'}" alt="${cardData.title}" class="discussion-card-image">
        </a>

        <div class="discussion-card-meta">
            <span class="time-left">🕒 ${cardData.time}</span>
        </div>
        <div class="discussion-card-footer">
            <div class="discussion-stats">
                <span>👁️ ${cardData.views}</span>
                <span>👍 ${cardData.likes}</span>
                <span>💬 ${cardData.comments}</span>
            </div>
            <div class="discussion-actions">
                <button class="icon-btn share-btn"><span>↗</span></button>
                <button class="icon-btn bookmark-btn ${isBookmarked ? 'active' : ''}"><span>□</span></button>
            </div>
        </div>
        
        <a href="${discussionLink}" class="discussion-join-btn">
            토론 참여하기
        </a>
    </div>
    `;
}

// ----- 4. 피드 렌더링 -----
function renderFeed() {
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
    const feedContainer = document.getElementById('discussion-list');
    const articles = dummyCommunityData[currentTopic] || [];

    feedContainer.innerHTML = '';

    if (articles.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 주제의 토론이 없습니다.</p>';
        return;
    }

    let allCardsHTML = '';
    articles.forEach(article => {
        allCardsHTML += createDiscussionCardHTML(article);
    });
    feedContainer.innerHTML = allCardsHTML;
}

// ----- 5. 이벤트 리스너 -----
document.addEventListener('DOMContentLoaded', () => {

    // 1. 토픽 태그 클릭
    const keywordTags = document.querySelectorAll('.keyword-tag');
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeed();
        });
    });

    // 2. 카드 내 버튼 이벤트 (북마크 + 공유)
    const discussionList = document.getElementById('discussion-list');
    discussionList.addEventListener('click', (e) => {
        // 북마크 버튼
        const bookmarkButton = e.target.closest('.bookmark-btn');
        if (bookmarkButton) {
            const card = bookmarkButton.closest('.discussion-card');
            const articleId = card.dataset.articleId;

            bookmarkButton.classList.toggle('active');
            const isBookmarked = bookmarkButton.classList.contains('active');

            if (isBookmarked) {
                if (!bookmarkedArticles.includes(articleId)) bookmarkedArticles.push(articleId);
            } else {
                bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
            }

            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarkedArticles));
            console.log('Updated Bookmarks:', bookmarkedArticles);
        }

        // 공유 버튼
        const shareButton = e.target.closest('.share-btn');
        if (shareButton) {
            const card = shareButton.closest('.discussion-card');
            
            // 🚨 [공유 링크] 공유는 보통 '토론방' 링크를 공유하므로 discussion 경로로 설정
            const url = `${window.location.origin}/discussion/templates/discussion/discussion-detail.html?id=${card.dataset.articleId}`;

            // 클립보드 복사
            navigator.clipboard.writeText(url).then(() => {
                alert('공유 링크가 복사되었습니다:\n' + url);
            }).catch(() => {
                alert('클립보드 복사에 실패했습니다.');
            });
        }
    });

    // 3. 페이지 로드 시 초기 렌더
    renderFeed();
});