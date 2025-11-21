let pinnedDiscussions = JSON.parse(localStorage.getItem("pinned_discussions")) || [];
let pinnedData = JSON.parse(localStorage.getItem("pinned_discussions_data")) || {};
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];

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

    return `
    <div class="discussion-card" data-article-id="${cardData.id}" data-end-time="${cardData.time}">
        <span class="card-category ${categoryClass}">${cardData.category}</span>
        <a href="${articleLink}" class="card-title-link"><h3 class="card-title">${cardData.title}</h3></a>
        <a href="${articleLink}" class="card-image-link"><img src="${cardData.image}" alt="${cardData.title}" class="discussion-card-image"></a>
        <div class="discussion-card-meta"><span class="time-left">🕒 ${cardData.time}</span></div>
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
        <a href="${discussionLink}" class="discussion-join-btn">토론 참여하기</a>
    </div>`;
}

function renderPinnedDiscussions() {
    const pinnedArea = document.getElementById("pinned-discussions");
    if (pinnedDiscussions.length === 0) {
        pinnedArea.innerHTML = `<h3 class="pinned-title">
                                    <img src="../../../static/image/thumbtacks.png" alt="고정핀" style="width: 24px; vertical-align: middle; margin-right: 8px;">
                                    고정된 토론
                                </h3>
                                <p class="no-pinned">현재 고정된 토론이 없습니다.</p>`;
        pinnedArea.style.minHeight = "100px"; // 고정된 영역의 최소 높이 설정
        return;
    }

    let html = `<h3 class="pinned-title">
                    <img src="../../../static/image/thumbtacks.png" alt="고정핀" style="width: 24px; vertical-align: middle; margin-right: 8px;">
                    고정된 토론
                </h3>`;
    const id = pinnedDiscussions[0];
    const item = pinnedData[id];
    if (item) {
        const discussionType = item.type === 'anonymous' ? 'discussion-anonymous' : 'discussion-realname';
        html += `<div class="pinned-item" data-id="${id}" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="window.location.href='../../../discussion/templates/discussion/${discussionType}.html?id=${id}'">
                    <span class="text" style="flex-grow: 1;">${item.title}</span>
                    <button class="unpin-btn" style="flex-shrink: 0;">고정 삭제</button>
                 </div>`;
    }
    pinnedArea.innerHTML = html;

    document.querySelectorAll(".unpin-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation(); // Prevent triggering the click on the pinned item
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

function pinDiscussion(discussionId, discussionData) {
    // 기존 고정된 토론방 제거
    if (pinnedDiscussions.length > 0) {
        const currentPinnedId = pinnedDiscussions[0];
        pinnedDiscussions = [];
        delete pinnedData[currentPinnedId];
        localStorage.setItem("pinned_discussions", JSON.stringify(pinnedDiscussions));
        localStorage.setItem("pinned_discussions_data", JSON.stringify(pinnedData));
    }

    // 새로운 토론방 고정
    pinnedDiscussions.push(discussionId);
    pinnedData[discussionId] = {
        id: discussionId,
        title: discussionData.title,
        type: discussionData.type || 'anonymous',
        category: discussionData.category,
        source: discussionData.source
    };
    localStorage.setItem("pinned_discussions", JSON.stringify(pinnedDiscussions));
    localStorage.setItem("pinned_discussions_data", JSON.stringify(pinnedData));
    renderPinnedDiscussions();
}

function renderFeed() {
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
    const feedContainer = document.getElementById('discussion-list');
    const articles = dummyCommunityData[currentTopic] || [];

    feedContainer.innerHTML = '';
    let html = '';
    articles.forEach(article => html += createDiscussionCardHTML(article));
    feedContainer.innerHTML = html;
}

function calculateRemainingTime(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return '종료됨';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}시간 ${minutes}분 남음`;
    } else {
        return `${minutes}분 남음`;
    }
}

function updateDiscussionTimes() {
    const cards = document.querySelectorAll('.discussion-card');
    cards.forEach(card => {
        const timeElement = card.querySelector('.time-left');
        const endTime = card.dataset.endTime;
        if (timeElement && endTime) {
            timeElement.textContent = `🕒 ${calculateRemainingTime(endTime)}`;
        }
    });
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

        if (e.target.closest(".discussion-join-btn")) {
            const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
            const discussionData = dummyCommunityData[currentTopic]?.find(article => article.id === id);
            if (discussionData) {
                // 고정 상태를 설정하기 전에 기존 상태 확인
                if (!pinnedDiscussions.includes(id)) {
                    pinDiscussion(id, discussionData);
                }
            }
        }
    });

    // 주기적으로 시간 업데이트
    setInterval(updateDiscussionTimes, 60000); // 1분마다 업데이트

    renderPinnedDiscussions();
    renderFeed();
    updateDiscussionTimes(); // 초기 호출
});
