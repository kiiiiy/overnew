<<<<<<< HEAD
// feed.js
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

// [FOLLOWING 탭용 데이터]
const dummyUserDatabase = {
    'kwon': {
        name: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권',
        scrap: [
            { id: 'kwon-1', topic: 'politics', category: '정치', source: '연합뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", views: '29k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-2', topic: 'society', category: '사회', source: 'YTN', title: "사회적 거리두기 그 후, 달라진 풍경들", views: '15k', time: '1시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'leftgabi': {
        name: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼',
        scrap: [
            { id: 'left-1', topic: 'economy', category: '경제', source: 'SBS', title: "'신혼가전 대기' LG전자 대리점장 구속", views: '18k', time: '30분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기... 개미들 '패닉'", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'kimlinky': {
        name: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김',
        scrap: [
            { id: 'kim-1', topic: 'economy', category: '경제', source: '조선일보', title: "타조가 제일 싸... '이것도' 아껴 판다", views: '12k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'ByeWind': {
        name: 'ByeWind', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=B',
        scrap: [
            { id: 'bye-1', topic: 'it', category: 'IT/과학', source: 'ZDNet', title: "애플 비전 프로 출시 임박", views: '100k', time: '방금 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'Natali': { name: 'Natali Craig', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', scrap: [{ id: 'nat-1', topic: 'economy', category: '경제', source: '매일경제', title: "비트코인 1억 돌파하나...", views: '80k', time: '10분 전', image: 'https://via.placeholder.com/100x60' }] },
    'Drew': { name: 'Drew Cano', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=D', scrap: [{ id: 'drew-1', topic: 'culture', category: '생활/문화', source: 'Vogue', title: "2025 SS 패션 트렌드", views: '12k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }] },
    'Orlando': { name: 'Orlando Diggs', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=O', scrap: [{ id: 'orl-1', topic: 'economy', category: '경제', source: 'WSJ', title: "미 연준, 금리 인하", views: '60k', time: '4시간 전', image: 'https://via.placeholder.com/100x60' }] },
    'Andi': { name: 'Andi Lane', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', scrap: [{ id: 'andi-1', topic: 'sport', category: '스포츠', source: '스포츠조선', title: "손흥민 리그 10호골", views: '200k', time: '방금 전', image: 'https://via.placeholder.com/100x60' }] },
    'NonFollow': { name: 'Non Follow User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', scrap: [{ id: 'non-1', topic: 'society', category: '사회', source: '한겨레', title: "저출산 문제 해결책", views: '5k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }] },
    'AnotherUser': { name: 'Another User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', scrap: [{ id: 'another-1', topic: 'politics', category: '정치', source: '경향신문', title: "선거구 획정안 논란", views: '8k', time: '3시간 전', image: 'https://via.placeholder.com/100x60' }] }
};

// ====================
// 2. 카드 생성 함수 (데이터 심기)
// ====================

function createHotCardHTML(cardData) {
    const viewIconPath = '../../../static/image/view.png'; 
    // 🚨 [핵심] 데이터 전체를 JSON 문자열로 변환해 HTML에 숨김
    const jsonString = JSON.stringify(cardData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

    return `
        <a href="#" class="article-card" data-article-json='${jsonString}'>
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
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const profileLink = `${profilePath}?user_id=${userId}`;

    // 북마크 여부 확인
    const bookmarkedList = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    const isBookmarked = bookmarkedList.some(item => item.id === articleData.id);
    const activeClass = isBookmarked ? 'active' : '';

    // 🚨 [핵심] 데이터 전체를 JSON 문자열로 변환
    const jsonString = JSON.stringify(articleData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

    return `
        <div class="following-card-group">
            <div class="follower-header">
                <a href="${profileLink}" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                    <img src="${userData.avatar}" class="card-avatar-small">
                    <strong>${userData.name}</strong>님이 스크랩한 기사
                </a>
            </div>
            
            <div class="article-card-wrapper" style="position: relative;">
                <a href="#" class="article-card" data-article-json='${jsonString}'>
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
                
                <button class="icon-btn bookmark-btn ${activeClass}" 
                    data-article-json='${jsonString}'
                    style="position: absolute; bottom: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.8); border-radius: 50%;">
                    <span>□</span>
                </button>
            </div>
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
    } else {
        const followingList = JSON.parse(localStorage.getItem('following_list')) || [];
        let hasContent = false;

        if (followingList.length === 0) {
            html = '<p style="text-align:center; color:#888; margin-top:60px;">아직 팔로우한 유저가 없습니다.<br>추천 탭에서 친구를 찾아보세요!</p>';
            container.innerHTML = html;
            return;
        }

        followingList.forEach(userId => {
            const user = dummyUserDatabase[userId];
            if (user && user.scrap) {
                const matchedArticles = user.scrap.filter(act => act.topic === topic);
                matchedArticles.forEach(article => {
                    html += createFollowingCardHTML(userId, user, article);
                    hasContent = true;
                });
            }
        });

        if (!hasContent) {
            html = '<p style="text-align:center; color:#888; margin-top:60px;">팔로우한 유저들이<br>이 주제의 기사를 스크랩하지 않았어요.</p>';
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

    const accountPath = '../../../account/templates/account/';
    const loginPath = accountPath + 'login.html';

    let currentView = viewHot.checked ? 'hot' : 'following';
    let currentTopic = currentView === 'hot' ? null : 'politics';

    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    const isLoggedIn = !!(userInfo && userInfo.nickname);

    // --- 로그인 체크 함수 ---
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

    // --- 비로그인 차단 ---
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

    // --- 초기 렌더링 ---
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');

    if(feedHot) feedHot.style.display = currentView === 'hot' ? 'flex' : 'none';
    if(feedFollowing) feedFollowing.style.display = currentView === 'following' ? 'flex' : 'none';
    if(keywordList) keywordList.style.display = currentView === 'following' ? 'flex' : 'none';
    renderFeedPage(currentView, currentTopic);

    // --- 탭 전환 ---
    viewHot.addEventListener('change', () => {
        currentView = 'hot';
        currentTopic = null;
        feedHot.style.display = 'flex';
        feedFollowing.style.display = 'none';
        keywordList.style.display = 'none';
        renderFeedPage(currentView, currentTopic);
    });

    viewFollowing.addEventListener('change', () => {
        currentView = 'following';
        currentTopic = 'politics';
        feedHot.style.display = 'none';
        feedFollowing.style.display = 'flex';
        keywordList.style.display = 'flex';
        renderFeedPage(currentView, currentTopic);
    });

    // --- 키워드 태그 클릭 ---
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic;
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage(currentView, currentTopic);
        });
    });

    // --- 햄버거 버튼 ---
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.href = accountPath + 'settings-logged-in.html';
            else window.location.href = accountPath + 'settings-logged-out.html';
        });
    }

    // ============================================================
    // 5. [핵심] 기사 클릭 및 북마크 이벤트 (통합 처리)
    // ============================================================
    
    // 공통 처리 함수: 기사 클릭 시 상세페이지 이동
// 공통 처리 함수: 기사 클릭 시 상세페이지 이동 (★ 이 함수만 교체하세요)
    // 공통 처리 함수: 기사 클릭 시 상세페이지 이동 (★ 이 함수만 교체하세요)
    function handleArticleClick(e) {
        // 1. 북마크 버튼 클릭 시 (이동 X, 저장 O)
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            e.preventDefault();
            e.stopPropagation();

            const articleData = JSON.parse(bookmarkBtn.dataset.articleJson);
            let bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
            const existingIndex = bookmarks.findIndex(item => item.id === articleData.id);

            if (existingIndex !== -1) {
                bookmarks.splice(existingIndex, 1);
                bookmarkBtn.classList.remove('active');
                alert('북마크가 취소되었습니다.');
            } else {
                bookmarks.push(articleData);
                bookmarkBtn.classList.add('active');
                alert('기사가 북마크되었습니다!');
            }
            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks));
            return;
        }

        // 2. 기사 카드 클릭 시 (이동 O, 선택 데이터 저장 O)
        const card = e.target.closest('.article-card');
        if (card) {
            e.preventDefault();
            
            let articleData = {};
            
            // HTML에 심어둔 JSON 데이터가 있으면 그걸 씀 (Following 탭 / Hot 탭 공통)
            if (card.dataset.articleJson) {
                const rawData = JSON.parse(card.dataset.articleJson);
                const articleTitle = rawData.title || "제목 없음";
                
                // 💡 [수정 내용] 본문에 ID와 제목을 넣어 데이터가 바뀌었음을 눈으로 확인
                articleData = {
                    ...rawData,
                    body: [
                        `✅ 현재 로드된 기사 제목: "${articleTitle}" (ID: ${rawData.id})`, // <-- 이 부분이 고유 ID를 보여줍니다.
                        "---",
                        "본문 내용이 여기에 들어갑니다. (더미 텍스트)",
                        `출처: ${rawData.source}, 이 기사는 ${rawData.category} 주제에 속합니다.`
                    ],
                    author: rawData.source || "OVERNEW 기자",
                    date: rawData.time || "2025.11.21",
                    mainImage: rawData.image || 'https://via.placeholder.com/400x300'
                };
            } 
            // 3. localStorage에 '선택된 기사' 저장
            localStorage.setItem('selected_article', JSON.stringify(articleData));

            // 4. 상세 페이지로 이동
            window.location.href = '../../../archive/templates/archive/article-detail.html';
        }
    }

    // 리스너 등록 (Hot, Following 둘 다 적용)
    if (feedHot) feedHot.addEventListener('click', handleArticleClick);
    if (feedFollowing) feedFollowing.addEventListener('click', handleArticleClick);

});
=======
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

        // 버튼 예시
        const isLoggedIn = true;
        document.getElementById('settings-menu-btn').addEventListener('click', () => {
            if (isLoggedIn) alert('설정 페이지 이동');
            else alert('로그인 필요');
        });
        document.getElementById('notifications-btn').addEventListener('click', () => {
            alert('알람 페이지 이동');
        });
    });
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
