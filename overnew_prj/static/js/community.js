<<<<<<< HEAD
let pinnedDiscussions = JSON.parse(localStorage.getItem("pinned_discussions")) || [];
let pinnedData = JSON.parse(localStorage.getItem("pinned_discussions_data")) || {};
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];

=======
// ----- 1. 가짜 데이터 (Dummy Data) -----
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
const dummyCommunityData = {
    it: [
        { id: 'article-ai-food', category: 'IT/과학', source: '뉴스웍스', title: "국민 건강 위협하는 '수입식품'...AI가 자동으로 걸러낸다", image: 'https://via.placeholder.com/280x180/0D47A1/FFFFFF?text=IT뉴스', time: '12 hours left', views: '25.9k', likes: 100, comments: 205 },
        { id: 'article-sds', category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", image: 'https://via.placeholder.com/180x120/0D47A1/FFFFFF?text=차트', time: '6 days left', views: '33k', likes: 431, comments: 192 }
    ],
    politics: [
        { id: 'article-politics-1', category: '정치', source: '서울신문', title: "정치 현안 토론, 7일간 진행됩니다.", image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', time: '3 days left', views: '10.2k', likes: 50, comments: 88 }
    ],
<<<<<<< HEAD
    economy: [], society: [], culture: [], world: [], enter: [], sport: []
};

function createDiscussionCardHTML(cardData) {
    const isBookmarked = bookmarkedArticles.includes(cardData.id);
    const topicClassMap = {
        'IT/과학': 'topic-it',
        '정치': 'topic-politics',
        '경제': 'topic-economy'
    };
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';

    const articleLink = `../../../archive/templates/archive/article-detail.html?id=${cardData.id}`;
    const discussionLink = `../../../discussion/templates/discussion/discussion-detail.html?id=${cardData.id}`;
=======
    economy: [], society: [], culture: [], world: []
};

// (NEW) localStorage에서 '좋아요', '북마크' 목록 불러오기
let likedArticles = JSON.parse(localStorage.getItem('liked_articles')) || [];
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];


// ----- 2. HTML 생성 함수 -----
// (NEW) 토론 카드 1개를 만드는 함수
function createDiscussionCardHTML(cardData) {
    
    // (핵심) 이 카드가 '좋아요'/'북마크' 되었는지 확인
    const isLiked = likedArticles.includes(cardData.id);
    const isBookmarked = bookmarkedArticles.includes(cardData.id);

    const topicClassMap = { 'IT/과학': 'topic-it', '정치': 'topic-politics', '경제': 'topic-economy' };
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16

    return `
    <div class="discussion-card" data-article-id="${cardData.id}">
        <span class="card-category ${categoryClass}">${cardData.category}</span>
<<<<<<< HEAD
        <a href="${articleLink}" class="card-title-link"><h3 class="card-title">${cardData.title}</h3></a>
        <a href="${articleLink}" class="card-image-link"><img src="${cardData.image}" alt="${cardData.title}" class="discussion-card-image"></a>
        <div class="discussion-card-meta"><span class="time-left">🕒 ${cardData.time}</span></div>
=======
        
        <h3 class="card-title">${cardData.title}</h3>
        
        <img src="${cardData.image || 'image-placeholder.jpg'}" alt="${cardData.title}" class="discussion-card-image">
        
        <div class="discussion-card-meta">
            <span class="time-left">🕒 ${cardData.time}</span>
        </div>
        
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
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
<<<<<<< HEAD
        <a href="${discussionLink}" class="discussion-join-btn">토론 참여하기</a>
    </div>`;
}

function renderPinnedDiscussions() {
    const pinnedArea = document.getElementById("pinned-discussions");
    if (pinnedDiscussions.length === 0) {
        pinnedArea.innerHTML = "";
        return;
    }

    let html = `<h3 class="pinned-title">📌 고정된 토론</h3>`;
    pinnedDiscussions.forEach(id => {
        const item = pinnedData[id];
        if (!item) return;
        html += `<div class="pinned-item" data-id="${id}">
                    <span>📌 ${item.title}</span>
                    <button class="unpin-btn" style="margin-left:8px; cursor:pointer;">❌ 고정 해제</button>
                 </div>`;
    });
    pinnedArea.innerHTML = html;

    document.querySelectorAll(".unpin-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const parent = e.target.closest(".pinned-item");
            const id = parent.dataset.id;
            pinnedDiscussions = pinnedDiscussions.filter(x => x !== id);
            delete pinnedData[id];
            localStorage.setItem("pinned_discussions", JSON.stringify(pinnedDiscussions));
            localStorage.setItem("pinned_discussions_data", JSON.stringify(pinnedData));
            renderPinnedDiscussions();
            renderFeed();
        });
    });
}

=======

        <a href="discussion-detail.html?id=${cardData.id}" class="discussion-join-btn">
            토론 참여하기
        </a>
    </div>
    `;
}

// ----- 3. 피드를 다시 그리는 메인 함수 -----
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
function renderFeed() {
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
    const feedContainer = document.getElementById('discussion-list');
    const articles = dummyCommunityData[currentTopic] || [];

<<<<<<< HEAD
    feedContainer.innerHTML = '';
    let html = '';
    articles.forEach(article => html += createDiscussionCardHTML(article));
    feedContainer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll('.keyword-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeed();
        });
    });

    const list = document.getElementById("discussion-list");
    list.addEventListener("click", e => {
        const card = e.target.closest(".discussion-card");
        if (!card) return;
        const id = card.dataset.articleId;

        if (e.target.closest(".share-btn")) {
            const url = `${location.origin}/discussion/templates/discussion/discussion-detail.html?id=${id}`;
            navigator.clipboard.writeText(url);
            alert("공유 링크가 복사되었습니다:\n" + url);
        }

        if (e.target.closest(".bookmark-btn")) {
            const btn = e.target.closest(".bookmark-btn");
            btn.classList.toggle("active");
            if (btn.classList.contains("active")) {
                if (!bookmarkedArticles.includes(id)) bookmarkedArticles.push(id);
            } else {
                bookmarkedArticles = bookmarkedArticles.filter(x => x !== id);
            }
            localStorage.setItem("bookmarked_articles", JSON.stringify(bookmarkedArticles));
        }
    });

    renderPinnedDiscussions();
    renderFeed();
=======
    feedContainer.innerHTML = ''; // 피드 비우기

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

// ----- 4. 이벤트 리스너(Event Listeners) 설정 -----
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 토픽(정치/경제...) 태그 리스너 ---
    const keywordTags = document.querySelectorAll('.keyword-tag');
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeed(); // 토픽이 바뀌면 피드를 다시 그림
        });
    });

    // --- 2. (핵심) 카드 내 '북마크' 버튼 리스너 (이벤트 위임) ---
    const discussionList = document.getElementById('discussion-list');
    discussionList.addEventListener('click', (e) => {
        
        // 클릭된 요소가 '.bookmark-btn'인지 확인
        const bookmarkButton = e.target.closest('.bookmark-btn');
        
        if (bookmarkButton) {
            // 1. 클릭된 카드의 고유 ID 찾기
            const card = bookmarkButton.closest('.discussion-card');
            const articleId = card.dataset.articleId;
            
            // 2. 버튼 UI 토글
            bookmarkButton.classList.toggle('active');
            const isBookmarked = bookmarkButton.classList.contains('active');
            
            // 3. localStorage 업데이트
            if (isBookmarked) {
                // [저장]
                if (!bookmarkedArticles.includes(articleId)) {
                    bookmarkedArticles.push(articleId);
                }
            } else {
                // [삭제]
                bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
            }
            
            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarkedArticles));
            console.log('Updated Bookmarks:', bookmarkedArticles);
        }
        
        // (확장) '.share-btn' 등 다른 버튼 로직도 여기에 추가...
        const shareButton = e.target.closest('.share-btn');
        if (shareButton) {
            alert('공유하기 링크가 복사되었습니다. (임시)');
        }
    });

    // --- 3. 페이지 첫 로드 시 ---
    renderFeed(); // 'IT/과학'(기본 active) 토픽으로 피드 한 번 그리기
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
});
