// ====================
// 1. 데이터 영역
// ====================

// [HOT 탭용 데이터]
const dummyData = {
    hot: {
        politics: [
            { id: 'hot-pol-1', category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", views: '42.9k', time: '5 hours ago', image: 'https://via.placeholder.com/100x60' },
            { id: 'hot-pol-2', category: '경제', source: 'SBS', title: 'APEC 효과?...한은 "경제 심리 4년 3개월만에 최고"', views: '32.6k', time: '4 hours ago', image: 'https://via.placeholder.com/100x60' }
        ],
        economy: [
            { id: 'hot-eco-1', category: '경제', source: 'SBS', title: '경제 심리 최고', views: '31.5k', time: '3 hours ago', image: 'https://via.placeholder.com/100x60' }
        ]
    }
};

// [FOLLOWING 탭용 데이터] - 유저별 활동 로그 (ID 기준)
const dummyUserDatabase = {
    'kwon': {
        name: '권또또',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권',
        activities: [
            { id: 'kwon-1', topic: 'politics', category: '정치', source: '연합뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", views: '29k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-2', topic: 'society', category: '사회', source: 'YTN', title: "사회적 거리두기 그 후, 달라진 풍경들", views: '15k', time: '1시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'leftgabi': {
        name: '왼가비',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼',
        activities: [
            { id: 'left-1', topic: 'economy', category: '경제', source: 'SBS', title: "'신혼가전 대기' LG전자 대리점장 구속", views: '18k', time: '30분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기...", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'kimlinky': {
        name: '김링키',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김',
        activities: [
            { id: 'kim-1', topic: 'economy', category: '경제', source: '조선일보', title: "타조가 제일 싸... '이것도' 아껴 판다", views: '12k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'ByeWind': {
        name: 'ByeWind',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=B',
        activities: [
            { id: 'bye-1', topic: 'it', category: 'IT/과학', source: 'ZDNet', title: "애플 비전 프로 출시 임박", views: '100k', time: '방금 전', image: 'https://via.placeholder.com/100x60' }
        ]
    }
};

// ====================
// 2. 카드 생성 함수
// ====================

function createHotCardHTML(cardData) {
    const viewIconPath = '../../../static/image/view.png'; 
    
    // 기사 상세 페이지 경로
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    const articleLink = `${articlePath}?id=${cardData.id || 'dummy'}`;

    return `
        <a href="${articleLink}" class="article-card">
            <div class="card-text">
                <span class="card-category">${cardData.category}</span>
                <span class="card-source">${cardData.source}</span>
                <h3 class="card-title">${cardData.title}</h3>
                <div class="card-stats">
                    <span><img src="${viewIconPath}" alt="조회수" class="stat-icon"> ${cardData.views}</span> <span>${cardData.time}</span>
                </div>
            </div>
            <img src="${cardData.image}" class="card-thumbnail">
        </a>
    `;
}

function createFollowingCardHTML(userId, userData, articleData) {
    const viewIconPath = '../../../static/image/view.png'; 
    
    // 1. 기사 상세 경로
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    const articleLink = `${articlePath}?id=${articleData.id || 'dummy'}`;

    // 2. 프로필 상세 경로 (유저 아이디 포함)
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const profileLink = `${profilePath}?user_id=${userId}`;

    return `
        <div class="following-card-group">
            <div class="follower-header">
                <a href="${profileLink}" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                    <img src="${userData.avatar}" class="card-avatar-small">
                    <strong>${userData.name}</strong>님이 열람한 기사
                </a>
            </div>
            <a href="${articleLink}" class="article-card">
                <div class="card-text">
                    <span class="card-category">${articleData.category}</span>
                    <span class="card-source">${articleData.source}</span>
                    <h3 class="card-title">${articleData.title}</h3>
                    <div class="card-stats">
                        <span><img src="${viewIconPath}" alt="조회수" class="stat-icon"> ${articleData.views}</span> <span>${articleData.time}</span>
                    </div>
                </div>
                <img src="${articleData.image}" class="card-thumbnail">
            </a>
        </div>
    `;
}

// ====================
// 3. 피드 렌더링 함수
// ====================
function renderFeedPage(view, topic) {
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');
    const container = view === 'hot' ? feedHot : feedFollowing;

    if (!container) return;

    container.innerHTML = '';
    let html = '';

    // --- [A] HOT 탭 렌더링 ---
    if (view === 'hot') {
        let articles = [];
        if (dummyData.hot) {
            Object.values(dummyData.hot).forEach(arr => { articles = articles.concat(arr); });
            articles = articles.slice(0, 10);
        }

        if (articles.length > 0) {
            articles.forEach(a => html += createHotCardHTML(a));
        } else {
            html = '<p style="text-align:center; color:#888; margin-top:40px;">핫한 기사가 없습니다.</p>';
        }
    } 
    
    // --- [B] FOLLOWING 탭 렌더링 (localStorage 연동) ---
    else {
        const followingList = JSON.parse(localStorage.getItem('following_list')) || [];
        let hasContent = false;

        if (followingList.length === 0) {
            html = '<p style="text-align:center; color:#888; margin-top:60px;">아직 팔로우한 유저가 없습니다.<br>추천 탭에서 친구를 찾아보세요!</p>';
            container.innerHTML = html;
            return;
        }

        followingList.forEach(userId => {
            const user = dummyUserDatabase[userId];
            
            if (user && user.activities) {
                const matchedArticles = user.activities.filter(act => act.topic === topic);
                
                matchedArticles.forEach(article => {
                    // userId를 인자로 전달
                    html += createFollowingCardHTML(userId, user, article);
                    hasContent = true;
                });
            }
        });

        if (!hasContent) {
            html = '<p style="text-align:center; color:#888; margin-top:60px;">팔로우한 유저들이<br>이 주제의 기사를 아직 보지 않았어요.</p>';
        }
    }

    container.innerHTML = html;
}

// ====================
// 4. 메인 로직 (이벤트 리스너)
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const keywordList = document.getElementById('keyword-list-container');
    const viewHot = document.getElementById('view-hot');
    const viewFollowing = document.getElementById('view-following');
    const bottomNav = document.querySelector('.bottom-nav');
    const settingsBtn = document.getElementById('settings-menu-btn');
    const notifBtn = document.getElementById('notifications-btn');

    // 경로 설정
    const accountPath = '../../../account/templates/account/';
    const loginPath = accountPath + 'login.html';

    // 초기 상태
    let currentView = viewHot.checked ? 'hot' : 'following';
    let currentTopic = currentView === 'hot' ? null : 'politics';

    // 로그인 확인
    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    const isLoggedIn = !!(userInfo && userInfo.nickname);

    // [함수] 로그인 필요 알림
    function requireLogin(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        if(viewHot) viewHot.checked = true; 
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'OVERNEW',
                text: '로그인이 필요한 기능이에요.',
                icon: 'warning',
                confirmButtonText: '로그인 하러가기',
                confirmButtonColor: '#6c5ce7'
            }).then((result) => {
                if (result.isConfirmed) window.location.href = loginPath;
            });
        } else {
            alert('로그인이 필요합니다.');
            window.location.href = loginPath;
        }
    }

    // [차단] 비로그인 시
    if (!isLoggedIn) {
        if (viewFollowing) viewFollowing.addEventListener('click', requireLogin);
        if (bottomNav) bottomNav.addEventListener('click', requireLogin, true);
        if (notifBtn) notifBtn.addEventListener('click', requireLogin);
    } else {
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                window.location.href = accountPath + 'notifications.html';
            });
        }
    }

    // 초기 화면 렌더링
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');

    if(feedHot) feedHot.style.display = currentView === 'hot' ? 'flex' : 'none';
    if(feedFollowing) feedFollowing.style.display = currentView === 'following' ? 'flex' : 'none';
    if(keywordList) keywordList.style.display = currentView === 'following' ? 'flex' : 'none';
    renderFeedPage(currentView, currentTopic);

    // 탭 전환 (HOT)
    viewHot.addEventListener('change', () => {
        currentView = 'hot';
        currentTopic = null;
        feedHot.style.display = 'flex';
        feedFollowing.style.display = 'none';
        keywordList.style.display = 'none';
        renderFeedPage(currentView, currentTopic);
    });

    // 탭 전환 (Following)
    viewFollowing.addEventListener('change', () => {
        currentView = 'following';
        currentTopic = 'politics';
        feedHot.style.display = 'none';
        feedFollowing.style.display = 'flex';
        keywordList.style.display = 'flex';
        renderFeedPage(currentView, currentTopic);
    });

    // 키워드 태그 클릭
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic;
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage(currentView, currentTopic);
        });
    });

    // 햄버거 버튼
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.href = accountPath + 'settings-logged-in.html';
            else window.location.href = accountPath + 'settings-logged-out.html';
        });
    }
});