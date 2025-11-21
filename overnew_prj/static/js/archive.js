// ============================================================
// 1. 데이터 영역
// ============================================================

// [내 데이터] - 아카이브 메인 '스크랩/북마크' 탭용 (더미 데이터 삭제됨)
const dummyMyData = {
    scrap: { politics: [], economy: [], society: [], it: [], culture: [], world: [], enter: [], sport: [] },
    bookmark: { politics: [], economy: [], society: [], it: [], culture: [], world: [], enter: [], sport: [] }
};

// [다른 유저 데이터] - (유지)
const dummyUserDatabase = {
    'kwon': {
        id: 'kwon', nickname: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', tags: ['정치', '사회'],
        scrap: [
            { id: 'kwon-1', topic: 'politics', category: '정치', source: '연합뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", views: '29k', time: '10분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'kwon-2', topic: 'society', category: '사회', source: 'YTN', title: "사회적 거리두기 그 후, 달라진 풍경들", views: '15k', time: '1시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'leftgabi': {
        id: 'leftgabi', nickname: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', tags: ['경제'],
        scrap: [
            { id: 'left-1', topic: 'economy', category: '경제', source: 'SBS', title: "'신혼가전 대기' LG전자 대리점장 구속", views: '18k', time: '30분 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기...", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'kimlinky': {
        id: 'kimlinky', nickname: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', tags: ['경제'],
        scrap: [
            { id: 'kim-1', topic: 'economy', category: '경제', source: '조선일보', title: "타조가 제일 싸... '이것도' 아껴 판다", views: '12k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'ByeWind': {
        id: 'ByeWind', nickname: 'ByeWind', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=B', tags: ['IT/과학', '문화'],
        scrap: [
            { id: 'bye-1', topic: 'it', category: 'IT/과학', source: 'ZDNet', title: "애플 비전 프로 출시 임박", views: '100k', time: '방금 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'Natali': {
        id: 'Natali', nickname: 'Natali Craig', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['경제', 'it'],
        scrap: [
            { id: 'nat-1', topic: 'economy', category: '경제', source: '매일경제', title: "비트코인 1억 돌파하나...", views: '80k', time: '10분 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'Drew': {
        id: 'Drew', nickname: 'Drew Cano', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=D', tags: ['문화'],
        scrap: [
            { id: 'drew-1', topic: 'culture', category: '생활/문화', source: 'Vogue', title: "2025 SS 패션 트렌드 총정리", views: '12k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'Orlando': {
        id: 'Orlando', nickname: 'Orlando Diggs', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=O', tags: ['경제'],
        scrap: [
            { id: 'orl-1', topic: 'economy', category: '경제', source: 'WSJ', title: "미 연준, 금리 인하 시기 조율 중", views: '60k', time: '4시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'Andi': {
        id: 'Andi', nickname: 'Andi Lane', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['it', '스포츠', '경제'],
        scrap: [
            { id: 'andi-1', topic: 'sport', category: '스포츠', source: '스포츠조선', title: "손흥민, 리그 10호골 폭발... 평점 9점", views: '200k', time: '방금 전', image: 'https://via.placeholder.com/100x60' },
            { id: 'andi-2', topic: 'it', category: 'IT/과학', source: '블로터', title: "갤럭시 S25 예상 렌더링 유출", views: '30k', time: '5시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'NonFollow': {
        id: 'NonFollow', nickname: 'Non Follow User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['사회'],
        scrap: [
            { id: 'non-1', topic: 'society', category: '사회', source: '한겨레', title: "저출산 문제, 근본적인 해결책은 무엇인가", views: '5k', time: '1일 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    },
    'AnotherUser': {
        id: 'AnotherUser', nickname: 'Another User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['정치'],
        scrap: [
            { id: 'another-1', topic: 'politics', category: '정치', source: '경향신문', title: "국회의원 선거구 획정안 논란", views: '8k', time: '3시간 전', image: 'https://via.placeholder.com/100x60' }
        ],
        bookmark: []
    }
};


// ============================================================
// 2. HTML 생성 함수 (유지)
// ============================================================

function createArticleCardHTML(cardData) {
    const topicClassMap = { 
        'IT/과학': 'topic-it', '경제': 'topic-economy', '사회': 'topic-society', '정치': 'topic-politics', 
        '연예': 'topic-enter', '스포츠': 'topic-sport', '생활/문화': 'topic-culture', '세계': 'topic-world'
    };

    const categoryClass = topicClassMap[cardData.category] || 'topic-default';
    const cardTitle = cardData.title || "제목 정보 없음";
    
    // 🚨 [수정] data-article-json에 데이터를 심고, href를 #으로 바꿉니다.
    const jsonString = JSON.stringify(cardData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

    return `
        <a href="#" class="article-card" data-article-json='${jsonString}'>
            <div class="card-text">
                <span class="card-category ${categoryClass}">${cardData.category}</span>
                <span class="card-source">${cardData.source}</span>
                <h3 class="card-title">${cardTitle}</h3>
                <div class="card-stats">
                    <span class="views">👁️ ${cardData.views}</span>
                    <span class="time">${cardData.time}</span>
                </div>
            </div>
            <img src="${cardData.image || 'image-placeholder.jpg'}" alt="${cardTitle}" class="card-thumbnail">
        </a>`;
}

function createUserListItemHTML(userData) {
    const tagsHTML = userData.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
    const followingClass = userData.isFollowing ? 'followed' : 'not-followed'; 
    const buttonText = userData.isFollowing ? '언팔로우' : '팔로우'; 
    
    return `
        <div class="user-list-item-wrapper ${followingClass}">
            <a href="profile-detail.html?user_id=${userData.id}" class="user-list-item-info">
                <img src="${userData.avatar}" alt="${userData.nickname}" class="card-avatar-small">
                <div class="user-info">
                    <span class="nickname">${userData.nickname}</span>
                    <div class="user-tags">${tagsHTML}</div>
                </div>
            </a>
            <button type="button" class="follow-toggle-btn ${followingClass}" data-user-id="${userData.id}">
                ${buttonText}
            </button>
        </div>`;
}


// ============================================================
// 3. 렌더링 함수
// ============================================================

// [아카이브 메인] 스크랩/북마크 탭 렌더링
function renderFeed() {
    const tabInput = document.querySelector('input[name="archive-tab"]:checked');
    if (!tabInput) return; 

    const currentTab = tabInput.value; // 'scrap' or 'bookmark'
    const currentTopicEl = document.querySelector('#scrap-bookmark-content .keyword-tag.active');
    const currentTopic = currentTopicEl ? currentTopicEl.dataset.topic : 'politics'; // topic ID

    const feedContainer = document.getElementById(`feed-${currentTab}`);
    if (!feedContainer) return;

    feedContainer.innerHTML = '';

    let articles = [];
    if (currentTab === 'scrap') {
        const savedScrapObject = JSON.parse(localStorage.getItem('scrapped_articles') || '{}');
        const savedTopicArticles = savedScrapObject[currentTopic] || [];
        articles = savedTopicArticles;
    } else if (currentTab === 'bookmark') {
        const allBookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
        
        const currentTopicText = currentTopicEl ? currentTopicEl.textContent.trim() : '';

        const savedTopicBookmarks = allBookmarks.filter(article => {
            const matchesTopicId = article.topic && article.topic === currentTopic;
            const matchesCategoryKo = article.category && article.category === currentTopicText;
            
            return matchesTopicId || matchesCategoryKo;
        });
        
        articles = savedTopicBookmarks;
    }

    if (articles.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 주제의 기사가 없습니다.</p>';
        return;
    }
    articles.forEach(article => {
        feedContainer.innerHTML += createArticleCardHTML(article); 
    });
}

// [아카이브 메인] 팔로잉 탭 (유저 목록) 렌더링
function renderFollowingList(searchTerm = "") {
    const listContainer = document.getElementById('following-list');
    if (!listContainer) return; 
    
    let realFollowingList = JSON.parse(localStorage.getItem('following_list')) || [];
    const allUsersArray = Object.values(dummyUserDatabase);

    allUsersArray.forEach(user => {
        user.isFollowing = realFollowingList.includes(user.id);
    });

    const normalizedSearch = searchTerm.toLowerCase();
    let usersToShow = allUsersArray.filter(user => {
        if (searchTerm) {
            return user.nickname.toLowerCase().includes(normalizedSearch);
        } else {
            return user.isFollowing;
        }
    });

    usersToShow.sort((a, b) => {
        if (a.isFollowing === b.isFollowing) return 0;
        return a.isFollowing ? -1 : 1;
    });

    listContainer.innerHTML = ''; 

    if (usersToShow.length === 0) {
        const msg = searchTerm ? '일치하는 사용자가 없습니다.' : '팔로잉 중인 사용자가 없습니다.';
        listContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 50px;">${msg}</p>`;
        return;
    }
    
    usersToShow.forEach(user => {
        listContainer.innerHTML += createUserListItemHTML(user);
    });

    document.querySelectorAll('.follow-toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            const isNowFollowing = button.classList.contains('followed'); 
            let currentList = JSON.parse(localStorage.getItem('following_list')) || [];

            if (isNowFollowing) {
                currentList = currentList.filter(id => id !== userId);
            } else {
                if (!currentList.includes(userId)) currentList.push(userId);
            }
            
            localStorage.setItem('following_list', JSON.stringify(currentList));
            console.log('Updated Following List:', currentList);
            
            renderFollowingList(searchTerm); 
        });
    });
}


// ============================================================
// 4. 프로필 상세 페이지 로직 (profile-detail.html)
// ============================================================
function initProfileDetailPage() {
    const followBtn = document.getElementById('profile-follow-btn');
    const profileNicknameEl = document.getElementById('profile-nickname');
    const profileTagsEl = document.getElementById('profile-tags');
    const profileFollowersEl = document.getElementById('profile-followers');
    const profileAvatarEl = document.getElementById('profile-avatar');

    if (!followBtn || !profileNicknameEl) return;
    
    // 1. URL에서 user_id 파싱
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('user_id'); 
    
    // 2. DB에서 유저 찾기
    const targetUser = dummyUserDatabase[targetUserId];

    if (!targetUser) {
        profileNicknameEl.textContent = "사용자 없음";
        followBtn.style.display = 'none'; 
        return;
    }
    
    // 3. 팔로우 상태 확인 (localStorage)
    let followingList = JSON.parse(localStorage.getItem('following_list')) || [];
    let isFollowing = followingList.includes(targetUserId);

    // 4. 버튼 UI 업데이트 함수
    const updateFollowButton = () => {
        if (isFollowing) {
            followBtn.textContent = '언팔로우';
            followBtn.classList.add('followed');
            followBtn.classList.remove('not-followed');
        } else {
            followBtn.textContent = '팔로우';
            followBtn.classList.add('not-followed');
            followBtn.classList.remove('followed');
        }
    };

    // 5. 프로필 정보 표시
    profileNicknameEl.textContent = targetUser.nickname;
    if (profileAvatarEl) profileAvatarEl.src = targetUser.avatar;
    if (profileTagsEl) profileTagsEl.textContent = targetUser.tags.map(t => `#${t}`).join(' ');
    if (profileFollowersEl) profileFollowersEl.textContent = `팔로워: ${targetUser.id.length * 100}명`; 
    
    updateFollowButton();

    // 6. 팔로우 버튼 클릭 이벤트
    followBtn.addEventListener('click', () => {
        isFollowing = !isFollowing; // 상태 토글

        if (isFollowing) {
            if (!followingList.includes(targetUserId)) followingList.push(targetUserId);
        } else {
            followingList = followingList.filter(id => id !== targetUserId);
        }

        localStorage.setItem('following_list', JSON.stringify(followingList));
        updateFollowButton();
    });

    // 7. 탭 및 피드 렌더링 로직
    const tabInputs = document.querySelectorAll('input[name="profile-tab"]');
    const keywordTags = document.querySelectorAll('.keyword-list .keyword-tag'); 
    
    const renderProfileFeed = () => {
        const currentTab = document.querySelector('input[name="profile-tab"]:checked').value;
        const activeTag = document.querySelector('.keyword-list .keyword-tag.active');
        // 만약 선택된 태그가 없으면 기본값 'politics' 등 설정
        const currentTopic = activeTag ? activeTag.dataset.topic : 'politics'; 
        
        const listContainer = document.getElementById(currentTab === 'scrap' ? 'profile-scrap-list' : 'profile-bookmark-list');
        
        if (!listContainer) return;
        listContainer.innerHTML = '';
        
        // 해당 유저의 스크랩/북마크 데이터 가져오기 (topic 필터링)
        let articles = (targetUser[currentTab] || []).filter(item => item.topic === currentTopic);
        
        if (articles.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 20px;">이 주제의 기사가 없습니다.</p>';
            return;
        }
        articles.forEach(article => {
            listContainer.innerHTML += createArticleCardHTML(article);
        });
    };
    
    // 탭 전환 이벤트
    tabInputs.forEach(input => {
        input.addEventListener('change', () => {
            document.getElementById('content-scrap').style.display = (input.value === 'scrap') ? 'block' : 'none';
            document.getElementById('content-bookmark').style.display = (input.value === 'bookmark') ? 'block' : 'none';
            renderProfileFeed();
        });
    });
    
    // 태그 클릭 이벤트
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderProfileFeed();
        });
    });

    // 초기 렌더링
    renderProfileFeed();
}


// ============================================================
// 5. 기사 스크랩 기능 (create-scrap.html)
// ============================================================
function initScrapFeature() { 
    const topicButtons = document.querySelectorAll('.topic-grid-button');
    const linkInput = document.getElementById('article-link');
    const clearLinkBtn = document.getElementById('clear-link-btn'); 
    const submitBtn = document.getElementById('submit-scrap-btn');
    const sourceInput = document.getElementById('article-source');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    if (!topicButtons.length || !linkInput) return; 

    let selectedTopic = null;

    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTopic = button.dataset.topic;
        });
    });

    if(clearSourceBtn) clearSourceBtn.addEventListener('click', () => { sourceInput.value = ''; });
    if(clearLinkBtn) clearLinkBtn.addEventListener('click', () => { linkInput.value = ''; });

    submitBtn.addEventListener('click', () => {
        const linkValue = linkInput.value.trim();
        const sourceValue = sourceInput ? sourceInput.value.trim() : '외부기사'; 
        
        if (!selectedTopic) { alert('기사의 분야(토픽)를 1개 선택해주세요.'); return; }
        if (!linkValue) { alert('기사 링크를 입력해주세요.'); return; }

        let savedScraps = JSON.parse(localStorage.getItem('scrapped_articles') || '{}');
        
        // 한글 카테고리명 매핑
        const categoryMap = {
            politics: '정치', economy: '경제', society: '사회', culture: '생활/문화',
            it: 'IT/과학', world: '세계', enter: '연예', sport: '스포츠'
        };

        const newArticle = {
            category: categoryMap[selectedTopic] || selectedTopic,
            source: sourceValue, 
            title: linkValue, 
            views: '0k',
            time: '방금 전', 
            image: 'image-placeholder.jpg'
        };

        if (!savedScraps[selectedTopic]) savedScraps[selectedTopic] = [];
        savedScraps[selectedTopic].unshift(newArticle);
        localStorage.setItem('scrapped_articles', JSON.stringify(savedScraps));

        alert('기사가 스크랩되었습니다!');
        window.location.href = 'archive.html';
    });
}


// ============================================================
// 6. 메인 실행 (DOMContentLoaded)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const tabInputs = document.querySelectorAll('input[name="archive-tab"]');
    const isArchivePage = tabInputs.length > 0;
    const submitBtn = document.getElementById('submit-scrap-btn');
    const isScrapPage = !!submitBtn;
    const isProfileDetailPage = document.title.includes('프로필');

    // --- A. 로그인 확인 ---
    const nicknameEl = document.getElementById('user-nickname');
    if (nicknameEl || isArchivePage || isScrapPage || isProfileDetailPage) { 
        const userInfo = JSON.parse(localStorage.getItem('current-session')); // current-session 확인 권장
        
        if (!userInfo) {
            // 로그인 안 됐으면 튕겨내기
            // alert('로그인이 필요한 페이지입니다.');
            // window.location.href = '../../../account/templates/account/login.html';
            // return;
        } else {
            // 로그인 됐으면 정보 표시
            const tagsEl = document.getElementById('user-tags');
            const followersEl = document.getElementById('user-followers');
            if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '사용자';
            if (tagsEl) tagsEl.textContent = (userInfo.topics && userInfo.topics.length > 0) ? userInfo.topics.map(t => `#${t}`).join(' ') : '#관심분야_없음';
            if (followersEl) followersEl.textContent = '팔로워 : 2023명 (dummy)';
        }
    }
    
    // --- B. 뒤로 가기 시 탭 상태 강제 복원 ---
    const activeArchiveTab = document.querySelector('input[name="archive-tab"]:checked');
    if (isArchivePage && activeArchiveTab) {
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');

        if (activeArchiveTab.value === 'following') {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'none';
            if (followingContent) followingContent.style.display = 'block';
            if (typeof renderFollowingList === 'function') renderFollowingList(document.getElementById('search-user')?.value || "");
        } else {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'block';
            if (followingContent) followingContent.style.display = 'none';
            if (typeof renderFeed === 'function') renderFeed();
        }
    }

    // --- C. 페이지별 초기화 함수 호출 ---
    if (isScrapPage) initScrapFeature();
    if (isProfileDetailPage) initProfileDetailPage();
    
    // --- D. 아카이브 탭 전환 이벤트 ---
    if (isArchivePage) { 
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');
        const fab = document.querySelector('.floating-action-button');

        tabInputs.forEach(input => {
            input.addEventListener('change', () => {
                if (input.value === 'following') {
                    if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'none';
                    if (followingContent) followingContent.style.display = 'block';
                    if(fab) fab.style.display = 'none';
                    renderFollowingList();
                } else {
                    if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'block';
                    if (followingContent) followingContent.style.display = 'none';
                    if(fab) fab.style.display = 'flex';
                    
                    const feedScrap = document.getElementById('feed-scrap');
                    const feedBookmark = document.getElementById('feed-bookmark');
                    if (feedScrap) feedScrap.style.display = (input.value === 'scrap') ? 'block' : 'none';
                    if (feedBookmark) feedBookmark.style.display = (input.value === 'bookmark') ? 'block' : 'none';
                    renderFeed();
                }
            });
        });

        const keywordTags = document.querySelectorAll('#scrap-bookmark-content .keyword-tag');
        keywordTags.forEach(tag => {
            tag.addEventListener('click', () => {
                keywordTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                renderFeed();
            });
        });

        const searchInput = document.getElementById('search-user');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderFollowingList(e.target.value);
            });
        }
    }
    
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
    
    // 🚨 [문제의 중복 블록] - 이 블록 전체가 중복을 일으키고 있습니다.
    const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');

    function handleArchiveArticleClick(e) {
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
            window.location.href = 'article-detail.html'; // 🚨 상대 경로로 이동
        }
    }

    // --- 이벤트 리스너 등록 ---
    const feedScrap = document.getElementById('feed-scrap');
    const feedBookmark = document.getElementById('feed-bookmark');

    if (feedScrap) feedScrap.addEventListener('click', handleArchiveArticleClick);
    if (feedBookmark) feedBookmark.addEventListener('click', handleArchiveArticleClick);
    
}); // 🚨 [문제의 중복 블록] - 이 닫는 괄호는 기존의 archive.js의 메인 DOMContentLoaded의 닫는 괄호입니다.

// 🚨 [여기에 또 다른 DOMContentLoaded 블록이 시작됨 - 이것 때문에 충돌!]
document.addEventListener('DOMContentLoaded', () => {
    const buttons = ['like-btn', 'discuss-btn', 'bookmark-btn'];

    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if(btn){
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
            });
        }
    });
    // 뒤로가기 버튼
    document.getElementById("back-button").addEventListener("click", function () {
        history.back();
    });
});