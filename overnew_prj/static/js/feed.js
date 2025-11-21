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

// [FOLLOWING 탭용 데이터] - 유저별 활동 로그 (스크랩 & 북마크 완비)
const dummyUserDatabase = {
    // 1. 권또또 (정치, 사회)
    'kwon': {
        name: '권또또',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권',
        scrap: [
            { id: 'kwon-1', topic: 'politics', category: '정치', source: '연합뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", views: '29k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-2', topic: 'society', category: '사회', source: 'YTN', title: "사회적 거리두기 그 후, 달라진 풍경들", views: '15k', time: '1시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'kwon-bk-1', topic: 'economy', category: '경제', source: '매일경제', title: "2025년 부동산 시장 전망 보고서", views: '5k', time: '1일 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-bk-2', topic: 'it', category: 'IT/과학', source: '블로터', title: "생성형 AI가 바꾸는 일자리 지도", views: '10k', time: '3일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 2. 왼가비 (경제)
    'leftgabi': {
        name: '왼가비',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼',
        scrap: [
            { id: 'left-1', topic: 'economy', category: '경제', source: 'SBS', title: "'신혼가전 대기' LG전자 대리점장 구속", views: '18k', time: '30분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기... 개미들 '패닉'", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'left-bk-1', topic: 'politics', category: '정치', source: '경향신문', title: "국회 예산안 심사 돌입, 여야 공방 예상", views: '3k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 3. 김링키 (경제)
    'kimlinky': {
        name: '김링키',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김',
        scrap: [
            { id: 'kim-1', topic: 'economy', category: '경제', source: '조선일보', title: "타조가 제일 싸... '이것도' 아껴 판다", views: '12k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'kim-bk-1', topic: 'culture', category: '생활/문화', source: '보그 코리아', title: "올겨울 패션 트렌드 키워드 5", views: '20k', time: '2일 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kim-bk-2', topic: 'sport', category: '스포츠', source: '네이버스포츠', title: "프로야구 FA 시장 개장, 대어급 이동하나", views: '40k', time: '1주 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 4. ByeWind (IT/과학, 문화)
    'ByeWind': {
        name: 'ByeWind',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=B',
        scrap: [
            { id: 'bye-1', topic: 'it', category: 'IT/과학', source: 'ZDNet', title: "애플 비전 프로 출시 임박, 시장 반응은?", views: '100k', time: '방금 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'bye-2', topic: 'culture', category: '생활/문화', source: '씨네21', title: "이번 주말에 볼만한 넷플릭스 신작 추천", views: '5k', time: '3시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'bye-bk-1', topic: 'world', category: '세계', source: 'BBC', title: "기후 변화로 인한 해수면 상승, 심각 단계", views: '8k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 5. Natali Craig (경제, IT)
    'Natali': {
        name: 'Natali Craig',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N',
        scrap: [
            { id: 'nat-1', topic: 'economy', category: '경제', source: '매일경제', title: "비트코인 1억 돌파하나... 전문가들의 엇갈린 전망", views: '80k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'nat-2', topic: 'it', category: 'IT/과학', source: 'TechCrunch', title: "AI 스타트업 투자 열풍, 버블인가 기회인가", views: '45k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'nat-bk-1', topic: 'society', category: '사회', source: '한국일보', title: "MZ세대 직장인들이 퇴사를 결심하는 이유", views: '60k', time: '3일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 6. Drew Cano (문화)
    'Drew': {
        name: 'Drew Cano',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=D',
        scrap: [
            { id: 'drew-1', topic: 'culture', category: '생활/문화', source: 'Vogue', title: "2025 SS 패션 트렌드 총정리", views: '12k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'drew-bk-1', topic: 'enter', category: '연예', source: '디스패치', title: "유명 아이돌 그룹 컴백 소식", views: '90k', time: '10시간 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'drew-bk-2', topic: 'world', category: '세계', source: 'CNN', title: "유럽 여행하기 좋은 도시 Best 10", views: '30k', time: '1주 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 7. Orlando Diggs (경제)
    'Orlando': {
        name: 'Orlando Diggs',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=O',
        scrap: [
            { id: 'orl-1', topic: 'economy', category: '경제', source: 'WSJ', title: "미 연준, 금리 인하 시기 조율 중", views: '60k', time: '4시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'orl-bk-1', topic: 'politics', category: '정치', source: '워싱턴포스트', title: "미국 대선, 주요 쟁점 분석", views: '40k', time: '2일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 8. Andi Lane (IT, 스포츠, 경제)
    'Andi': {
        name: 'Andi Lane',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A',
        scrap: [
            { id: 'andi-1', topic: 'sport', category: '스포츠', source: '스포츠조선', title: "손흥민, 리그 10호골 폭발... 평점 9점", views: '200k', time: '방금 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'andi-2', topic: 'it', category: 'IT/과학', source: '블로터', title: "갤럭시 S25 예상 렌더링 유출", views: '30k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'andi-bk-1', topic: 'enter', category: '연예', source: 'OSEN', title: "인기 드라마 시즌2 제작 확정", views: '70k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    // 9. Non Follow User (사회)
    'NonFollow': {
        name: 'Non Follow User',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N',
        scrap: [
            { id: 'non-1', topic: 'society', category: '사회', source: '한겨레', title: "저출산 문제, 근본적인 해결책은 무엇인가", views: '5k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    // 10. Another User (정치)
    'AnotherUser': {
        name: 'Another User',
        avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A',
        scrap: [
            { id: 'another-1', topic: 'politics', category: '정치', source: '경향신문', title: "국회의원 선거구 획정안 논란", views: '8k', time: '3시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: [
            { id: 'another-bk-1', topic: 'society', category: '사회', source: '동아일보', title: "고령화 사회 진입, 노인 복지 정책 점검", views: '2k', time: '2일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    }
};

// ====================
// 2. 카드 생성 함수
// ====================

function createHotCardHTML(cardData) {
    const viewIconPath = '../../../static/image/view.png'; 
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
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    const articleLink = `${articlePath}?id=${articleData.id || 'dummy'}`;
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const profileLink = `${profilePath}?user_id=${userId}`;

    // 북마크 여부 확인 (버튼 색칠용)
    const bookmarkedList = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    const isBookmarked = bookmarkedList.some(item => item.id === articleData.id);
    const activeClass = isBookmarked ? 'active' : '';

    return `
        <div class="following-card-group" data-article-json='${JSON.stringify(articleData).replace(/'/g, "&#39;")}'>
            <div class="follower-header">
                <a href="${profileLink}" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                    <img src="${userData.avatar}" class="card-avatar-small">
                    <strong>${userData.name}</strong>님이 스크랩한 기사
                </a>
            </div>
            <div class="article-card-wrapper" style="position: relative;">
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
                <button class="icon-btn bookmark-btn ${activeClass}" style="position: absolute; bottom: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.8); border-radius: 50%;">
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
    
    // --- [B] FOLLOWING 탭 렌더링 ---
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
            
            // 🚨 [수정 핵심] activities 대신 scrap을 확인!
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

    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');

    if(feedHot) feedHot.style.display = currentView === 'hot' ? 'flex' : 'none';
    if(feedFollowing) feedFollowing.style.display = currentView === 'following' ? 'flex' : 'none';
    if(keywordList) keywordList.style.display = currentView === 'following' ? 'flex' : 'none';
    renderFeedPage(currentView, currentTopic);

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

    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic;
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage(currentView, currentTopic);
        });
    });

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.href = accountPath + 'settings-logged-in.html';
            else window.location.href = accountPath + 'settings-logged-out.html';
        });
    }

    // 🚨 [추가] 북마크 버튼 클릭 이벤트 (이벤트 위임)
    if (feedFollowing) {
        feedFollowing.addEventListener('click', (e) => {
            const btn = e.target.closest('.bookmark-btn');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const cardGroup = btn.closest('.following-card-group');
            const articleData = JSON.parse(cardGroup.dataset.articleJson);
            let bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
            const existingIndex = bookmarks.findIndex(item => item.id === articleData.id);

            if (existingIndex !== -1) {
                bookmarks.splice(existingIndex, 1);
                btn.classList.remove('active');
                alert('북마크가 취소되었습니다.');
            } else {
                bookmarks.push({
                    category: articleData.category,
                    source: articleData.source,
                    title: articleData.title,
                    views: articleData.views,
                    time: articleData.time,
                    image: articleData.image,
                    id: articleData.id
                });
                btn.classList.add('active');
                alert('기사가 북마크되었습니다!');
            }
            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks));
        });
    }
});