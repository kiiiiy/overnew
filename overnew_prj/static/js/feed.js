// ====================
// 1. Dummy Data
// ====================
const dummyData = {
    hot: {
        politics: [
            { category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", views: '42.9k', time: '5 hours ago', image: 'samsung-sds-chart.jpg' },
            { category: '경제', source: 'SBS', title: 'APEC 효과?...한은 "경제 심리 4년 3개월만에 최고"', views: '32.6k', time: '4 hours ago', image: 'apec-market.jpg' },
            { category: 'IT/과학', source: '뉴스웍스', title: "LG CNS, 공공·금융 AI 혁신 성과로 'IT서비스 혁신대상'", views: '31.9k', time: '5 hours ago', image: 'lg-cns-award.jpg' }
        ],
        economy: [
            { category: '경제', source: 'SBS', title: 'APEC 효과?...한은 "경제 심리 4년 3개월만에 최고"', views: '32.6k', time: '4 hours ago', image: 'apec-market.jpg' }
        ]
    },

    following: {
        politics: [
            { followerName: '홍길동', articleSource: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'jung-chung-rae.jpg', category: '정치' },
            { followerName: '김병비', articleSource: '서울신문', title: "[데스크시각] 비호감 정치의 위험성", views: '37.4k', time: '2 hours ago', image: 'kim-byung-bi.jpg', category: '정치' }
        ],
        economy: [
            { followerName: '홍길동', articleSource: '한국경제', title: "경제 기사입니다. 팔로워가 읽었습니다.", views: '10k', time: '1 hours ago', image: 'apec-market.jpg', category: '경제' }
        ]
    }
};

// ====================
// HOT 카드 생성
// ====================
function createHotCardHTML(cardData) {
    return `
        <a href="article-detail.html" class="article-card">
            <div class="card-text">
                <span class="card-category">${cardData.category}</span>
                <span class="card-source">${cardData.source}</span>
                <h3 class="card-title">${cardData.title}</h3>
                <div class="card-stats">
                    <span class="views">👁️ ${cardData.views}</span>
                    <span class="time">${cardData.time}</span>
                </div>
            </div>
            <img src="${cardData.image}" class="card-thumbnail">
        </a>
    `;
}

// ====================
// FOLLOWING 카드 생성
// ====================
function createFollowingCardHTML(cardData) {
    return `
        <div class="following-card-group">
            <div class="follower-header">
                <img src="avatar-placeholder.png" class="card-avatar-small">
                <strong>${cardData.followerName}</strong>님이 열람한 기사입니다
            </div>
            <a href="article-detail.html" class="article-card">
                <div class="card-text">
                    <span class="card-category">${cardData.category}</span>
                    <span class="card-source">${cardData.articleSource}</span>
                    <h3 class="card-title">${cardData.title}</h3>
                    <div class="card-stats">
                        <span class="views">👁️ ${cardData.views}</span>
                        <span class="time">${cardData.time}</span>
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
function renderFeedPage() {
    const currentView = document.getElementById('view-hot').checked ? 'hot' : 'following';
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;

    const feedHotContainer = document.getElementById('feed-hot');
    const feedFollowingContainer = document.getElementById('feed-following');
    const feedContainer = currentView === 'hot' ? feedHotContainer : feedFollowingContainer;

    feedContainer.innerHTML = '';

    const articles = dummyData[currentView][currentTopic] || [];

    if (articles.length === 0) {
        feedContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">이 주제의 기사 없음</p>';
        return;
    }

    let html = '';
    if (currentView === 'hot') {
        articles.forEach(a => html += createHotCardHTML(a));
    } else {
        articles.forEach(a => html += createFollowingCardHTML(a));
    }

    feedContainer.innerHTML = html;
}

// ====================
// 이벤트 리스너
// ====================
document.addEventListener('DOMContentLoaded', () => {

    const keywordList = document.getElementById('keyword-list-container');

    // 초기 설정
    document.getElementById('feed-hot').style.display = 'flex';
    document.getElementById('feed-following').style.display = 'none';
    keywordList.style.display = 'none';

    // HOT 클릭
    document.getElementById('view-hot').addEventListener('change', () => {
        document.getElementById('feed-hot').style.display = 'flex';
        document.getElementById('feed-following').style.display = 'none';
        keywordList.style.display = 'none';
        renderFeedPage();
    });

    // FOLLOWING 클릭
    document.getElementById('view-following').addEventListener('change', () => {
        document.getElementById('feed-hot').style.display = 'none';
        document.getElementById('feed-following').style.display = 'flex';
        keywordList.style.display = 'flex';
        renderFeedPage();
    });

    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage();
        });
    });

    renderFeedPage();
});
