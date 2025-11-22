// ====================
// Dummy Data
// ====================
const dummyData = {
    hot: {
        politics: [
            { category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", views: '42.9k', time: '5 hours ago', image: 'https://via.placeholder.com/100x60' },
            { category: '경제', source: 'SBS', title: 'APEC 효과?...한은 "경제 심리 4년 3개월만에 최고"', views: '32.6k', time: '4 hours ago', image: 'https://via.placeholder.com/100x60' }
        ],
        economy: [
            { category: '경제', source: 'SBS', title: '경제 심리 최고', views: '31.5k', time: '3 hours ago', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    following: {
        politics: [
            { followerName: '홍길동', articleSource: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'https://via.placeholder.com/100x60', category: '정치' },
            { followerName: '김병비', articleSource: '서울신문', title: "비호감 정치의 위험성", views: '37.4k', time: '2 hours ago', image: 'https://via.placeholder.com/100x60', category: '정치' }
        ],
        economy: [
            { followerName: '홍길동', articleSource: '한국경제', title: "경제 기사입니다.", views: '10k', time: '1 hours ago', image: 'https://via.placeholder.com/100x60', category: '경제' }
        ]
    }
};

// ====================
// 카드 생성
// ====================
function createHotCardHTML(cardData) {
    return `
            <a class="article-card">
                <div class="card-text">
                    <span class="card-category">${cardData.category}</span>
                    <span class="card-source">${cardData.source}</span>
                    <h3 class="card-title">${cardData.title}</h3>
                    <div class="card-stats">
                        <span>👁️ ${cardData.views}</span> <span>${cardData.time}</span>
                    </div>
                </div>
                <img src="${cardData.image}" class="card-thumbnail">
            </a>
        `;
}

function createFollowingCardHTML(cardData) {
    return `
            <div class="following-card-group">
                <div class="follower-header">
                    <img src="https://via.placeholder.com/20" class="card-avatar-small">
                    <strong>${cardData.followerName}</strong>님이 열람한 기사
                </div>
                <a class="article-card">
                    <div class="card-text">
                        <span class="card-category">${cardData.category}</span>
                        <span class="card-source">${cardData.articleSource}</span>
                        <h3 class="card-title">${cardData.title}</h3>
                        <div class="card-stats">
                            <span>👁️ ${cardData.views}</span> <span>${cardData.time}</span>
                        </div>
                    </div>
                    <img src="${cardData.image}" class="card-thumbnail">
                </a>
            </div>
        `;
}

// ====================
// 피드 렌더링
// ====================
function renderFeedPage(view, topic) {
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');
    const container = view === 'hot' ? feedHot : feedFollowing;

    container.innerHTML = '';

    let articles = [];
    if (view === 'hot') {
        Object.values(dummyData.hot).forEach(arr => { articles = articles.concat(arr); });
        articles = articles.slice(0, 10); // 최대 10개
    } else {
        articles = dummyData.following[topic] || [];
    }

    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">이 주제의 기사 없음</p>';
        return;
    }

    let html = '';
    if (view === 'hot') articles.forEach(a => html += createHotCardHTML(a));
    else articles.forEach(a => html += createFollowingCardHTML(a));

    container.innerHTML = html;
}

// ====================
// DOMContentLoaded
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const keywordList = document.getElementById('keyword-list-container');
    let currentView = document.getElementById('view-hot').checked ? 'hot' : 'following';
    let currentTopic = currentView === 'hot' ? null : 'politics';

    // 초기 표시
    document.getElementById('feed-hot').style.display = currentView === 'hot' ? 'flex' : 'none';
    document.getElementById('feed-following').style.display = currentView === 'following' ? 'flex' : 'none';
    keywordList.style.display = currentView === 'following' ? 'flex' : 'none';
    renderFeedPage(currentView, currentTopic);

    // 라디오 버튼
    document.getElementById('view-hot').addEventListener('change', () => {
        currentView = 'hot';
        currentTopic = null;
        document.getElementById('feed-hot').style.display = 'flex';
        document.getElementById('feed-following').style.display = 'none';
        keywordList.style.display = 'none';
        renderFeedPage(currentView, currentTopic);
    });

    document.getElementById('view-following').addEventListener('change', () => {
        currentView = 'following';
        currentTopic = 'politics';
        document.getElementById('feed-hot').style.display = 'none';
        document.getElementById('feed-following').style.display = 'flex';
        keywordList.style.display = 'flex';
        renderFeedPage(currentView, currentTopic);
    });

    // 키워드 클릭
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic;
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage(currentView, currentTopic);
        });
    });

    // 버튼 예시 (수정된 부분)
    // const isLoggedIn = true; // 이 변수는 이제 사용하지 않습니다.

    document.getElementById('settings-menu-btn').addEventListener('click', () => {
        // 로그인 유무 체크 없이 바로 설정 페이지로 이동
        window.location.href = '/account/settings/';
    });

});