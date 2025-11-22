// -----------------------------
// 0. localStorage 상태 (좋아요/북마크)
// -----------------------------
let likedArticles = JSON.parse(localStorage.getItem('liked_articles')) || [];
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];

// -----------------------------
// 1. 도우미 함수: 남은 시간 라벨
// -----------------------------
function formatTimeLabel(timeString) {
    // 백엔드에서 이미 예쁜 라벨(time)을 내려주기 때문에
    // 여기서는 그냥 그 값을 사용하거나, 없으면 time_end로 계산해도 됨.
    return timeString || '';
}

// -----------------------------
// 2. 카드 HTML 생성 함수
// -----------------------------
function createDiscussionCardHTML(cardData) {
    // cardData.id: 토론방(room_id), cardData.article_id: 기사 PK
    const articleKey = `room_${cardData.id}`;

    const isLiked = likedArticles.includes(articleKey);
    const isBookmarked = bookmarkedArticles.includes(articleKey);

    const topicClassMap = {
        'IT/과학': 'topic-it',
        '정치': 'topic-politics',
        '경제': 'topic-economy',
    };
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';

    const timeLabel = formatTimeLabel(cardData.time);

    return `
    <div class="discussion-card" data-article-id="${articleKey}">
        <span class="card-category ${categoryClass}">${cardData.category}</span>
        
        <h3 class="card-title">${cardData.title}</h3>
        
        <img src="${cardData.image || 'https://via.placeholder.com/280x180?text=No+Image'}"
             alt="${cardData.title}" class="discussion-card-image">
        
        <div class="discussion-card-meta">
            <span class="time-left">🕒 ${timeLabel}</span>
        </div>
        
        <div class="discussion-card-footer">
            <div class="discussion-stats">
                <span>👁️ ${cardData.views}</span>
                <span>👍 ${cardData.likes}</span>
                <span>💬 ${cardData.comments}</span>
            </div>
            <div class="discussion-actions">
                <button class="icon-btn share-btn"><span>↗</span></button>
                <button class="icon-btn bookmark-btn ${isBookmarked ? 'active' : ''}">
                    <span>□</span>
                </button>
            </div>
        </div>

        <a href="${cardData.enter_url}" class="discussion-join-btn">
            토론 참여하기
        </a>
    </div>
    `;
}

// -----------------------------
// 3. 특정 카테고리(nc_id)에 대해 API 호출 + 피드 렌더링
// -----------------------------
async function loadRoomsForCategory(ncId) {
    const feedContainer = document.getElementById('discussion-list');
    if (!feedContainer) return;

    // 로딩 표시
    feedContainer.innerHTML = `
        <p style="text-align:center; color:#888; margin-top:40px;">
            토론 목록을 불러오는 중입니다...
        </p>
    `;

    try {
        const url = `${window.ROOM_LIST_API_URL}?nc_id=${encodeURIComponent(ncId)}`;
        const resp = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        const rooms = data.rooms || [];

        if (rooms.length === 0) {
            feedContainer.innerHTML = `
                <p style="text-align:center; color:#888; margin-top:50px;">
                    이 주제의 토론이 없습니다.
                </p>
            `;
            return;
        }

        let allCardsHTML = '';
        rooms.forEach(room => {
            allCardsHTML += createDiscussionCardHTML(room);
        });
        feedContainer.innerHTML = allCardsHTML;

    } catch (err) {
        console.error('토론방 목록 불러오기 오류:', err);
        feedContainer.innerHTML = `
            <p style="text-align:center; color:#e74c3c; margin-top:50px;">
                토론 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
        `;
    }
}

// -----------------------------
// 4. 이벤트 리스너 설정
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    const keywordTags = document.querySelectorAll('.keyword-tag');
    const discussionList = document.getElementById('discussion-list');

    // 4-1. 카테고리 태그 클릭 시 → active 변경 + API 호출
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const ncId = tag.dataset.ncId;
            if (ncId) {
                loadRoomsForCategory(ncId);
            }
        });
    });

    // 4-2. 카드 내 북마크/공유 버튼 (이벤트 위임)
    if (discussionList) {
        discussionList.addEventListener('click', (e) => {
            const bookmarkButton = e.target.closest('.bookmark-btn');

            if (bookmarkButton) {
                const card = bookmarkButton.closest('.discussion-card');
                const articleId = card.dataset.articleId;

                bookmarkButton.classList.toggle('active');
                const isBookmarked = bookmarkButton.classList.contains('active');

                if (isBookmarked) {
                    if (!bookmarkedArticles.includes(articleId)) {
                        bookmarkedArticles.push(articleId);
                    }
                } else {
                    bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
                }

                localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarkedArticles));
                console.log('Updated Bookmarks:', bookmarkedArticles);
            }

            const shareButton = e.target.closest('.share-btn');
            if (shareButton) {
                alert('공유하기 링크가 복사되었습니다. (임시)');
            }
        });
    }

    // 4-3. 페이지 첫 로드 시 → 첫 번째 active 카테고리로 로드
    const activeTag = document.querySelector('.keyword-tag.active') || keywordTags[0];
    if (activeTag) {
        const ncId = activeTag.dataset.ncId;
        if (ncId) {
            loadRoomsForCategory(ncId);
        }
    }
});
