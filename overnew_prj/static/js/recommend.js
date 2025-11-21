<<<<<<< HEAD
// recommend.js
// ============================================================
// 1. 데이터 영역 (feed.js, archive.js와 동일)
// ============================================================
const dummyUserDatabase = {
    'kwon': {
        id: 'kwon', name: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', tags: ['정치', '사회'],
        scrap: [
            { id: 'kwon-1', topic: 'politics', category: '정치', source: '연합뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", views: '29k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-2', topic: 'society', category: '사회', source: 'YTN', title: "사회적 거리두기 그 후, 달라진 풍경들", views: '15k', time: '1시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'leftgabi': {
        id: 'leftgabi', name: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', tags: ['경제'],
        scrap: [
            { id: 'left-1', topic: 'economy', category: '경제', source: 'SBS', title: "'신혼가전 대기' LG전자 대리점장 구속", views: '18k', time: '30분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기... 개미들 '패닉'", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'kimlinky': {
        id: 'kimlinky', name: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', tags: ['경제'],
        scrap: [
            { id: 'kim-1', topic: 'economy', category: '경제', source: '조선일보', title: "타조가 제일 싸... '이것도' 아껴 판다", views: '12k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'ByeWind': {
        id: 'ByeWind', name: 'ByeWind', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=B', tags: ['IT/과학', '문화'],
        scrap: [
            { id: 'bye-1', topic: 'it', category: 'IT/과학', source: 'ZDNet', title: "애플 비전 프로 출시 임박, 시장 반응은?", views: '100k', time: '방금 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'Natali': {
        id: 'Natali', name: 'Natali Craig', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['경제', 'IT/과학'],
        scrap: [
            { id: 'nat-1', topic: 'economy', category: '경제', source: '매일경제', title: "비트코인 1억 돌파하나... 전문가들의 엇갈린 전망", views: '80k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'nat-2', topic: 'it', category: 'IT/과학', source: 'TechCrunch', title: "AI 스타트업 투자 열풍, 버블인가 기회인가", views: '45k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'Drew': {
        id: 'Drew', name: 'Drew Cano', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=D', tags: ['생활/문화'],
        scrap: [
            { id: 'drew-1', topic: 'culture', category: '생활/문화', source: 'Vogue', title: "2025 SS 패션 트렌드 총정리", views: '12k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'Orlando': {
        id: 'Orlando', name: 'Orlando Diggs', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=O', tags: ['경제'],
        scrap: [
            { id: 'orl-1', topic: 'economy', category: '경제', source: 'WSJ', title: "미 연준, 금리 인하 시기 조율 중", views: '60k', time: '4시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'Andi': {
        id: 'Andi', name: 'Andi Lane', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['IT/과학', '스포츠', '경제'],
        scrap: [
            { id: 'andi-1', topic: 'sport', category: '스포츠', source: '스포츠조선', title: "손흥민, 리그 10호골 폭발... 평점 9점", views: '200k', time: '방금 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'andi-2', topic: 'it', category: 'IT/과학', source: '블로터', title: "갤럭시 S25 예상 렌더링 유출", views: '30k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'NonFollow': {
        id: 'NonFollow', name: 'Non Follow User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['사회'],
        scrap: [
            { id: 'non-1', topic: 'society', category: '사회', source: '한겨레', title: "저출산 문제, 근본적인 해결책은 무엇인가", views: '5k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ]
    },
    'AnotherUser': {
        id: 'AnotherUser', name: 'Another User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['정치'],
        scrap: [
            { id: 'another-1', topic: 'politics', category: '정치', source: '경향신문', title: "국회의원 선거구 획정안 논란", views: '8k', time: '3시간 전', image: 'https://via.placeholder.com/100x60' }
        ]
    }
};

// ============================================================
// 2. HTML 생성 함수
// ============================================================
function createUserGroupHTML(userData, articleData) {
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    const profileLink = `${profilePath}?user_id=${userData.id}`;
    const articleDetailLink = `${articlePath}?id=${articleData.id}`; 
=======
// ----- 1. Dummy Data -----
const dummyData = {
    similar: {
        politics: [
            { user: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', userId: 'kwon',
              articles: [
                { id: 'article-sataedong', image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", source: '연합뉴스', reactions: '29' },
                { id: 'article-gookmin', noImage: true, title: "'미국의 관세-투자' 굴욕 협상에 생산 현장은 한숨 늘어나", source: '오마이뉴스 · 5시간전', reactions: null }
              ]
            }
        ],
        economy: [
            { user: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', userId: 'leftgabi',
              articles: [
                { id: 'article-lg', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "'신혼가전 대기' LG전자 대리점장 구속", source: 'SBS', reactions: '18' }
              ]
            },
            { user: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', userId: 'kimlinky',
              articles: [
                { id: 'article-tajo', noImage: true, title: "타조가 제일 싸... '이것도' 아껴 판다", source: '조선일보', reactions: null }
              ]
            }
        ],
        society: [], it: [], culture: [], world: []
    },
    opposite: {
        politics: [
            { user: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', userId: 'kwon',
              articles: [
                { id: 'article-daraengi', image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', title: "'다랭이' 10년 만에 2억 5000만번 달랬다...", source: '서울신문 · 7시간전', comments: '10+' }
              ]
            }
        ],
        economy: [
            { user: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', userId: 'leftgabi',
              articles: [
                { id: 'article-seoul-subway', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "서울 지하철은 지금…'보쌈에 순대까지'", source: '서울경제 · 2시간전', comments: '30+' }
              ]
            },
            { user: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', userId: 'kimlinky',
              articles: [
                { id: 'article-market', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "'바가지 논란' 광장시장 상인 '유튜버'", source: '조선일보 · 12시간전', comments: '100+' }
              ]
            }
        ],
        society: [], it: [], culture: [], world: []
    }
};

// ----- 2. Following List (localStorage) -----
let followingList = JSON.parse(localStorage.getItem('following_list')) || [];

// ----- 3. HTML 생성 함수 -----
function createUserGroupHTML(groupData, view) {
    const isFollowed = followingList.includes(groupData.userId);

    let articlesHTML = '';
    groupData.articles.forEach(article => {
        let reactionsHTML = '';
        if (view === 'similar') {
            reactionsHTML = article.reactions ? `<span class="meta-count">${article.reactions}</span>` : '';
        } else {
            reactionsHTML = article.comments ? `<span class="meta-comments">💬 ${article.comments}</span>` : '';
        }

        const noImageClass = article.noImage ? 'no-image' : '';
        const imageHTML = article.noImage ? '' : `
            <a href="article-detail.html?id=${article.id}" class="card-image-link">
                <img src="${article.image || 'image-placeholder.jpg'}" alt="${article.title}" class="card-image">
            </a>`;

        articlesHTML += `
        <div class="user-article ${noImageClass}">
            ${imageHTML}
            <div class="card-content">
                <a href="article-detail.html?id=${article.id}" class="card-title-link">
                    <h3 class="card-title">${article.title}</h3>
                </a>
                <div class="card-meta">
                    <span class="card-source">${article.source}</span>
                    <span class="card-reactions">${reactionsHTML}</span>
                </div>
            </div>
        </div>
        `;
    });
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16

    return `
    <div class="user-feed-group">
        <div class="user-feed-header">
<<<<<<< HEAD
            <a href="${profileLink}" class="user-profile-link" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                <img src="${userData.avatar}" alt="${userData.name}" class="card-avatar">
                <span class="card-username">${userData.name}</span>
            </a>
            <button class="follow-btn" data-userid="${userData.id}">
                팔로우
            </button>
        </div>
        
        <div class="user-article">
            <a href="${articleDetailLink}" class="card-image-link">
                <img src="${articleData.image || 'image-placeholder.jpg'}" alt="${articleData.title}" class="card-image">
            </a>
            <div class="card-content">
                <a href="${articleDetailLink}" class="card-title-link">
                    <h3 class="card-title">${articleData.title}</h3>
                </a>
                <div class="card-meta">
                    <span class="card-source">${articleData.source}</span>
                    <span class="card-reactions">
                        👁️ ${articleData.views}
                    </span>
                </div>
            </div>
        </div>
=======
            <a href="profile-detail.html?user=${groupData.userId}" class="user-profile-link">
                <img src="${groupData.avatar}" alt="${groupData.user}" class="card-avatar">
                <span class="card-username">${groupData.user}</span>
            </a>
            <button class="follow-btn ${isFollowed ? 'followed' : ''}" data-userid="${groupData.userId}">
                ${isFollowed ? '팔로잉' : '팔로우'}
            </button>
        </div>
        ${articlesHTML}
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
    </div>
    `;
}

<<<<<<< HEAD
// ============================================================
// 3. Feed 렌더링 (🚨 핵심: 한글->영어 매핑 추가)
// ============================================================
function renderFeed() {
    const viewSimilar = document.getElementById('view-similar');
    const currentView = viewSimilar.checked ? 'similar' : 'opposite';
    const feedContainer = document.getElementById(currentView === 'similar' ? 'feed-similar' : 'feed-opposite');

    // 1. 내 정보 가져오기 (한글 데이터)
    const myInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    const myRawTopics = myInfo.topics || [];

    // 🚨 [추가] 화면 상단에 내 관심사 표시하기
    const myInterestDisplay = document.getElementById('my-interest-display');
    if (myInterestDisplay) {
        if (myRawTopics.length > 0) {
            myInterestDisplay.textContent = myRawTopics.map(t => `#${t}`).join(' ');
        } else {
            myInterestDisplay.textContent = "설정된 관심사가 없습니다.";
        }
    }

    
    // 2. 🚨 [수정] 한글 관심사를 영어 ID로 변환
    const koToEnTopicMap = {
        '정치': 'politics',
        '경제': 'economy',
        '사회': 'society',
        '생활/문화': 'culture', // 또는 'culture'로 통일
        '문화': 'culture',      // 예외 처리
        'IT/과학': 'it',
        '세계': 'world',
        '연예': 'enter',
        '스포츠': 'sport'
    };

    // 변환된 영어 관심사 목록 (예: ['politics', 'economy'])
    const myTopics = myRawTopics.map(kor => koToEnTopicMap[kor] || kor);
    
    console.log("내 관심사(한글):", myRawTopics);
    console.log("내 관심사(변환됨):", myTopics);

    // 3. 팔로잉 목록 확인
    const followingList = JSON.parse(localStorage.getItem('following_list')) || [];

    feedContainer.innerHTML = '';
    let hasContent = false;

    // 4. 모든 유저 순회
    Object.values(dummyUserDatabase).forEach(user => {
        // 나 자신과 이미 팔로우한 사람은 건너뜀
        if (user.id === myInfo.userId || followingList.includes(user.id)) return;

        if (user.scrap && user.scrap.length > 0) {
            
            // 🚨 [수정] 기사의 topic(영어)과 내 관심사(영어)를 비교
            const targetArticles = user.scrap.filter(article => {
                const isMyInterest = myTopics.includes(article.topic);
                return (currentView === 'similar') ? isMyInterest : !isMyInterest;
            });

            targetArticles.forEach(article => {
                feedContainer.innerHTML += createUserGroupHTML(user, article);
                hasContent = true;
            });
        }
    });

    // 5. 결과 없음 처리
    if (!hasContent) {
        if (currentView === 'similar') {
            feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">회원님의 관심사와 일치하는 추천 기사가 없거나,<br>모두 팔로우 중입니다.</p>';
        } else {
            feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">반대 성향의 추천 기사가 없습니다.</p>';
        }
        return;
    }

    addFollowButtonListeners();
}

// ============================================================
// 4. Follow 버튼 이벤트 
// ============================================================
function addFollowButtonListeners() {
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        if (button.dataset.listenerAdded === "true") return;

        button.addEventListener('click', () => {
            const userIdToFollow = button.dataset.userid;
            let followingList = JSON.parse(localStorage.getItem('following_list')) || [];
            
            if (!followingList.includes(userIdToFollow)) {
                followingList.push(userIdToFollow);
                localStorage.setItem('following_list', JSON.stringify(followingList));
                
                button.textContent = '팔로잉';
                button.classList.add('followed');
            } else {
                followingList = followingList.filter(id => id !== userIdToFollow);
                localStorage.setItem('following_list', JSON.stringify(followingList));
                button.textContent = '팔로우';
                button.classList.remove('followed');
            }
            console.log('Updated Following List:', followingList);
        });
        
        button.dataset.listenerAdded = "true";
    });
}

// ============================================================
// 5. 이벤트 리스너 설정
// ============================================================
=======
// ----- 4. Feed 렌더링 -----
function renderFeed() {
    const currentView = document.getElementById('view-similar').checked ? 'similar' : 'opposite';
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
    const feedContainer = document.getElementById(currentView === 'similar' ? 'feed-similar' : 'feed-opposite');

    const userGroups = (dummyData[currentView] && dummyData[currentView][currentTopic]) ? dummyData[currentView][currentTopic] : [];

    feedContainer.innerHTML = '';

    if (userGroups.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 주제의 추천이 없습니다.</p>';
        return;
    }

    let allGroupsHTML = '';
    userGroups.forEach(group => {
        allGroupsHTML += createUserGroupHTML(group, currentView);
    });
    feedContainer.innerHTML = allGroupsHTML;

    addFollowButtonListeners();
}

// ----- 5. Follow 버튼 이벤트 ----- 
function addFollowButtonListeners() {
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        if (button.listenerAdded) return;

        button.addEventListener('click', () => {
            const userIdToFollow = button.dataset.userid;
            const isCurrentlyFollowed = button.classList.contains('followed');

            if (isCurrentlyFollowed) {
                button.classList.remove('followed');
                button.textContent = '팔로우';
                followingList = followingList.filter(id => id !== userIdToFollow);
            } else {
                button.classList.add('followed');
                button.textContent = '팔로잉';
                if (!followingList.includes(userIdToFollow)) followingList.push(userIdToFollow);
            }

            localStorage.setItem('following_list', JSON.stringify(followingList));
            console.log('Updated Following List:', followingList);
        });
        button.listenerAdded = true;
    });
}

// ----- 6. 이벤트 리스너 설정 -----
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
document.addEventListener('DOMContentLoaded', () => {
    const viewToggles = document.querySelectorAll('input[name="view-type"]');
    const feedSimilar = document.getElementById('feed-similar');
    const feedOpposite = document.getElementById('feed-opposite');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (toggle.value === 'similar' && toggle.checked) {
                feedSimilar.style.display = 'block';
                feedOpposite.style.display = 'none';
            } else if (toggle.value === 'opposite' && toggle.checked) {
                feedSimilar.style.display = 'none';
                feedOpposite.style.display = 'block';
            }
            renderFeed();
        });
    });

<<<<<<< HEAD
    const accountPath = '../../../account/templates/account/';
    const isLoggedIn = !!JSON.parse(localStorage.getItem('current-session'));
    const settingsBtn = document.getElementById('settings-menu-btn');
    const notifBtn = document.getElementById('notifications-btn');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.href = accountPath + 'settings-logged-in.html';
            else window.location.href = accountPath + 'settings-logged-out.html';
        });
    }

    if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();
                alert("로그인이 필요합니다.");
                window.location.href = accountPath + 'login.html';
            } else {
                window.location.href = accountPath + 'notifications.html';
            }
        });
    }

    renderFeed();
});
=======
    const keywordTags = document.querySelectorAll('.keyword-tag');
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeed();
        });
    });

    renderFeed();
});
>>>>>>> e7a7492e338da910a913fc80f1ff1026401d8d16
