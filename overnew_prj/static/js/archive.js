<<<<<<< HEAD
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
            { id: 'left-2', topic: 'economy', category: '경제', source: '한국경제', title: "코스피 3000선 붕괴 위기... 개미들 '패닉'", views: '50k', time: '2시간 전', image: 'https://via.placeholder.com/100x60' }
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
    'Natali': { id: 'Natali', nickname: 'Natali Craig', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['경제', 'it'], scrap: [], bookmark: [] },
    'Drew': { id: 'Drew', nickname: 'Drew Cano', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=D', tags: ['문화'], scrap: [], bookmark: [] },
    'Orlando': { id: 'Orlando', nickname: 'Orlando Diggs', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=O', tags: ['경제'], scrap: [], bookmark: [] },
    'Andi': { id: 'Andi', nickname: 'Andi Lane', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['it', '스포츠', '경제'], scrap: [], bookmark: [] },
    'NonFollow': { id: 'NonFollow', nickname: 'Non Follow User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=N', tags: ['사회'], scrap: [], bookmark: [] },
    'AnotherUser': { id: 'AnotherUser', nickname: 'Another User', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=A', tags: ['정치'], scrap: [], bookmark: [] }
};


// ============================================================
// 2. HTML 생성 함수
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
    const viewIconPath = '../../../static/image/view.png'; // 뷰 아이콘 경로 정의

    return `
        <a href="#" class="article-card" data-article-json='${jsonString}'>
            <div class="card-text">
                <span class="card-category ${categoryClass}">${cardData.category}</span>
                <span class="card-source">${cardData.source}</span>
                <h3 class="card-title">${cardTitle}</h3>
                <div class="card-stats">
                    <span class="views"><img src="${viewIconPath}" alt="조회수" class="stat-icon"> ${cardData.views}</span>
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
    const currentTopic = currentTopicEl ? currentTopicEl.dataset.topic : 'politics'; 

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
=======
// ----- 1. Dummy Data -----
const dummyScrapData = {
    scrap: {
        politics: [{ category: '정치', source: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'jung-chung-rae.jpg' }],
        economy: [{ category: '경제', source: 'SBS', title: 'APEC 효과?...', views: '32.6k', time: '4 hours ago', image: 'apec-market.jpg' }],
        society: [], 
        it: [], 
        culture: [{ category: '생활/문화', source: '문화일보', title: '생활 문화 뉴스입니다.', views: '1.2k', time: '1일 전', image: 'image-placeholder.jpg' }], // ⭐ 임시 데이터 추가
        world: [{ category: '세계', source: 'CNN', title: '해외 주요 소식입니다.', views: '5.5k', time: '5시간 전', image: 'image-placeholder.jpg' }],     // ⭐ 임시 데이터 추가
        enter: [], sport: []
    },
    bookmark: {
        politics: [{ category: '정치', source: '뉴스웍스', title: "북마크한 정치 기사입니다.", views: '31.9k', time: '5 hours ago', image: 'lg-cns-award.jpg' }],
        economy: [], society: [], it: [], 
        culture: [], // ⭐ 임시 데이터 필요 시 추가
        world: [],   // ⭐ 임시 데이터 필요 시 추가
        enter: [], sport: []
    }
};

const dummyAllUsers = [
    { id: 'ByeWind', nickname: 'ByeWind', tags: ['IT/과학', '문화'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Natali', nickname: 'Natali Craig', tags: ['경제', 'it'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Drew', nickname: 'Drew Cano', tags: ['문화'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Orlando', nickname: 'Orlando Diggs', tags: ['경제'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Andi', nickname: 'Andi Lane', tags: ['it', '스포츠', '경제'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'NonFollow', nickname: 'Non Follow User', tags: ['사회'], isFollowing: false, avatar: 'avatar-placeholder.png' },
    { id: 'AnotherUser', nickname: 'Another User', tags: ['정치'], isFollowing: false, avatar: 'avatar-placeholder.png' }
];

// ----- 2. HTML 생성 함수 (카테고리 표시 및 스타일 클래스 최종 수정) -----
function createArticleCardHTML(cardData) {
    // data-topic 값(politics, economy 등 소문자 영문)과 표시할 한글 이름 매핑 (렌더링 시 사용)
    const topicDisplayMap = {
        'IT/과학': 'IT/과학', '경제': '경제', '사회': '사회', '정치': '정치', '연예': '연예', '스포츠': '스포츠', '생활/문화': '생활/문화', '세계': '세계',
        'Politics': '정치', 'Economy': '경제', 'Society': '사회', 'Culture': '생활/문화', 'It': 'IT/과학', 'World': '세계', 
        'Enter': '연예', 'Sport': '스포츠' 
    };
    
    // CSS 클래스 매핑 (저장된 대문자 시작 카테고리와 더미 데이터의 한글 카테고리 모두 처리)
    const topicClassMap = { 
        'IT/과학': 'topic-it', '경제': 'topic-economy', '사회': 'topic-society', '정치': 'topic-politics', '연예': 'topic-enter', '스포츠': 'topic-sport', '생활/문화': 'topic-culture', '세계': 'topic-world', 
        'Politics': 'topic-politics', 'Economy': 'topic-economy', 'Society': 'topic-society', 'Culture': 'topic-culture', 'It': 'topic-it', 'World': 'topic-world', 
        'Entertainment': 'topic-enter', 'Sports': 'topic-sport' 
    };

    const categoryText = topicDisplayMap[cardData.category] || cardData.category;
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';

    return `
        <a href="article-detail.html" class="article-card">
            <div class="card-text">
                <span class="card-category ${categoryClass}">${categoryText}</span>
                <span class="card-source">${cardData.source}</span>
                <h3 class="card-title">${cardData.title}</h3>
                <div class="card-stats">
                    <span class="views">👁️ ${cardData.views}</span>
                    <span class="time">${cardData.time}</span>
                </div>
            </div>
            <img src="${cardData.image || 'image-placeholder.jpg'}" alt="${cardData.title}" class="card-thumbnail">
        </a>`;
}

function createUserListItemHTML(userData) {
    const tagsHTML = userData.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
    const followingClass = userData.isFollowing ? 'followed' : 'not-followed';
    return `
        <a href="profile-detail.html" class="user-list-item ${followingClass}">
            <img src="${userData.avatar}" alt="${userData.nickname}" class="card-avatar-small">
            <div class="user-info">
                <span class="nickname">${userData.nickname}</span>
                <div class="user-tags">${tagsHTML}</div>
            </div>
        </a>`;
}

// ----- 3. 렌더링 함수 (오류 방지 코드 포함) -----
function renderFeed() {
    // 탭 요소가 없으면 실행 중단 (오류 방지)
    const tabInput = document.querySelector('input[name="archive-tab"]:checked');
    if (!tabInput) return; 

    const currentTab = tabInput.value;
    const currentTopic = document.querySelector('#scrap-bookmark-content .keyword-tag.active').dataset.topic;

    const feedScrap = document.getElementById('feed-scrap');
    const feedBookmark = document.getElementById('feed-bookmark');

    if (!feedScrap || !feedBookmark) return;

    feedScrap.innerHTML = '';
    feedBookmark.innerHTML = '';

    let articles = [];
    if (currentTab === 'scrap') {
        const defaultArticles = dummyScrapData.scrap[currentTopic] || [];
        const savedArticles = JSON.parse(localStorage.getItem('scrapped_articles') || '{}');
        const savedTopicArticles = savedArticles[currentTopic] || [];
        articles = savedTopicArticles.concat(defaultArticles); // 로컬 스토리지 기사가 더미 데이터보다 우선
    } else if (currentTab === 'bookmark') {
        articles = dummyScrapData.bookmark[currentTopic] || [];
    }

    const feedContainer = document.getElementById(`feed-${currentTab}`);
    if (!feedContainer) return;

    if (articles.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 주제의 기사가 없습니다.</p>';
        return;
    }
    articles.forEach(article => {
        feedContainer.innerHTML += createArticleCardHTML(article);
    });
}

>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
function renderFollowingList(searchTerm = "") {
    const listContainer = document.getElementById('following-list');
    if (!listContainer) return; 
    
<<<<<<< HEAD
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

    // 1. URL 확인 및 내 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('user_id'); 
    const myInfo = JSON.parse(localStorage.getItem('user-info'));
    const targetUser = dummyUserDatabase[targetUserId];



    if (!targetUser) {
        profileNicknameEl.textContent = "사용자 없음";
        followBtn.style.display = 'none'; 
        return;
    }
    
    let followingList = JSON.parse(localStorage.getItem('following_list')) || [];
    let isFollowing = followingList.includes(targetUserId);

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

    profileNicknameEl.textContent = targetUser.nickname;
    if (profileAvatarEl) profileAvatarEl.src = targetUser.avatar;
    if (profileTagsEl) profileTagsEl.textContent = targetUser.tags.map(t => `#${t}`).join(' ');
    if (profileFollowersEl) profileFollowersEl.textContent = `팔로워: ${targetUser.id.length * 100}명`; 
    
    updateFollowButton();

    followBtn.addEventListener('click', () => {
        isFollowing = !isFollowing; 
        if (isFollowing) {
            if (!followingList.includes(targetUserId)) followingList.push(targetUserId);
        } else {
            followingList = followingList.filter(id => id !== targetUserId);
        }
        localStorage.setItem('following_list', JSON.stringify(followingList));
        updateFollowButton();
    });

    const tabInputs = document.querySelectorAll('input[name="profile-tab"]');
    const keywordTags = document.querySelectorAll('.keyword-list .keyword-tag'); 
    
    const renderProfileFeed = () => {
        const currentTab = document.querySelector('input[name="profile-tab"]:checked').value;
        const activeTag = document.querySelector('.keyword-list .keyword-tag.active');
        const currentTopic = activeTag ? activeTag.dataset.topic : 'politics'; 
        
        const listContainer = document.getElementById(currentTab === 'scrap' ? 'profile-scrap-list' : 'profile-bookmark-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        
        let articles = (targetUser[currentTab] || []).filter(item => item.topic === currentTopic);
        
        if (articles.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 20px;">이 주제의 기사가 없습니다.</p>';
            return;
        }
        articles.forEach(article => {
            listContainer.innerHTML += createArticleCardHTML(article);
        });
    };
    
    tabInputs.forEach(input => {
        input.addEventListener('change', () => {
            document.getElementById('content-scrap').style.display = (input.value === 'scrap') ? 'block' : 'none';
            document.getElementById('content-bookmark').style.display = (input.value === 'bookmark') ? 'block' : 'none';
            renderProfileFeed();
        });
    });
    
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderProfileFeed();
        });
    });

    renderProfileFeed();
}


// ============================================================
// 5. 기사 스크랩 기능 (create-scrap.html)
// ============================================================
function initScrapFeature() { 
=======
    listContainer.innerHTML = '';

    const normalizedSearch = searchTerm.toLowerCase();
    const usersToShow = dummyAllUsers.filter(user => {
        const match = user.nickname.toLowerCase().includes(normalizedSearch);
        return searchTerm ? match : user.isFollowing;
    });

    if (usersToShow.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">일치하는 사용자가 없습니다.</p>';
        return;
    }
    usersToShow.forEach(user => {
        listContainer.innerHTML += createUserListItemHTML(user);
    });
}

// ----- 4. 기사 스크랩 기능 (언론사 및 X버튼 작동 보장) -----
function initScrapFeature() {
    // 필수 요소들 모두 가져오기 
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
    const topicButtons = document.querySelectorAll('.topic-grid-button');
    const linkInput = document.getElementById('article-link');
    const clearLinkBtn = document.getElementById('clear-link-btn'); 
    const submitBtn = document.getElementById('submit-scrap-btn');
<<<<<<< HEAD
    const sourceInput = document.getElementById('article-source');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    if (!topicButtons.length || !linkInput) return; 
=======
    
    // 언론사 관련 요소들
    const sourceInput = document.getElementById('article-source');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    // 필수 요소 체크
    if (!topicButtons.length || !linkInput || !submitBtn || !sourceInput || !clearLinkBtn || !clearSourceBtn) {
        return; 
    }
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982

    let selectedTopic = null;

    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTopic = button.dataset.topic;
        });
    });

<<<<<<< HEAD
    if(clearSourceBtn) clearSourceBtn.addEventListener('click', () => { sourceInput.value = ''; });
    if(clearLinkBtn) clearLinkBtn.addEventListener('click', () => { linkInput.value = ''; });

    submitBtn.addEventListener('click', () => {
        const linkValue = linkInput.value.trim();
        const sourceValue = sourceInput ? sourceInput.value.trim() : '외부기사'; 
        
        if (!selectedTopic) { alert('기사의 분야(토픽)를 1개 선택해주세요.'); return; }
        if (!linkValue) { alert('기사 링크를 입력해주세요.'); return; }

        let savedScraps = JSON.parse(localStorage.getItem('scrapped_articles') || '{}');
        
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

=======
    // 언론사 'x' 버튼 작동
    clearSourceBtn.addEventListener('click', () => {
        sourceInput.value = ''; 
    });

    // 링크 'x' 버튼 작동
    clearLinkBtn.addEventListener('click', () => {
        linkInput.value = '';
    });

    submitBtn.addEventListener('click', () => {
        const linkValue = linkInput.value.trim();
        const sourceValue = sourceInput.value.trim(); 
        
        if (!selectedTopic) {
            alert('기사의 분야(토픽)를 1개 선택해주세요.');
            return;
        }
        if (!linkValue) {
            alert('기사 링크를 입력해주세요.');
            return;
        }

        let savedScraps = JSON.parse(localStorage.getItem('scrapped_articles') || '{}');
        // 로컬 스토리지에 저장할 때 카테고리 명을 대문자 시작 영문으로 통일 (렌더링 함수에서 한글로 변환됨)
        const capitalizedCategory = selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1);
        
        const newArticle = {
            category: capitalizedCategory,
            source: sourceValue || '외부기사', 
            title: linkValue,
            views: '0k',
            time: 'Just now',
            image: 'image-placeholder.jpg'
        };

        // selectedTopic (소문자 영문 키)를 사용하여 배열에 저장
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
        if (!savedScraps[selectedTopic]) savedScraps[selectedTopic] = [];
        savedScraps[selectedTopic].unshift(newArticle);
        localStorage.setItem('scrapped_articles', JSON.stringify(savedScraps));

        alert('기사가 스크랩되었습니다!');
        window.location.href = 'archive.html';
    });
}

<<<<<<< HEAD

// ============================================================
// 6. 메인 실행 (DOMContentLoaded - 통합)
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
        const userInfo = JSON.parse(localStorage.getItem('user-info')) || sessionInfo;
        
        if (!userInfo) {
             // 로그인 체크 필요 시 주석 해제
        } else {
            const tagsEl = document.getElementById('user-tags');
            const followersEl = document.getElementById('user-followers');
            if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '사용자';
            // 🚨 [수정] topics 배열을 #태그 형태로 변환
            if (tagsEl) {
                if (userInfo.topics && userInfo.topics.length > 0) {
                    tagsEl.textContent = userInfo.topics.map(t => `#${t}`).join(' ');
                } else {
                    tagsEl.textContent = '#관심분야_없음';
                }
            }
            if (followersEl) followersEl.textContent = '팔로워 : 2023명 (dummy)';
        }
    }
    
    // --- B. 뒤로 가기 시 탭 상태 강제 복원 ---
    const storedTab = sessionStorage.getItem('activeArchiveTab'); // 1. 저장된 탭을 가져옴
    
    let activeArchiveTab = document.querySelector('input[name="archive-tab"]:checked');
    
    // 2. 세션에 저장된 탭이 있고, 현재 체크된 탭과 다르다면 강제 체크
    if (isArchivePage && storedTab && activeArchiveTab && activeArchiveTab.value !== storedTab) {
        activeArchiveTab.checked = false;
        
        const targetInput = document.querySelector(`input[name="archive-tab"][value="${storedTab}"]`);
        if (targetInput) {
            targetInput.checked = true;
            activeArchiveTab = targetInput; 
        }
    }
    // ----------------------------------------------------

    if (isArchivePage && activeArchiveTab) {
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');
        const fab = document.querySelector('.floating-action-button');
        const currentTabValue = activeArchiveTab.value; 

        if (currentTabValue === 'following') {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'none';
            if (followingContent) followingContent.style.display = 'block';
            if (fab) fab.style.display = 'none';
            if (typeof renderFollowingList === 'function') renderFollowingList(document.getElementById('search-user')?.value || "");
        } else {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'block';
            if (followingContent) followingContent.style.display = 'none';
            if (fab) fab.style.display = 'flex';
            
            const feedScrap = document.getElementById('feed-scrap');
            const feedBookmark = document.getElementById('feed-bookmark');
            if (feedScrap) feedScrap.style.display = (currentTabValue === 'scrap') ? 'flex' : 'none';
            if (feedBookmark) feedBookmark.style.display = (currentTabValue === 'bookmark') ? 'flex' : 'none';
            
            if (typeof renderFeed === 'function') renderFeed();
        }
    }

    // --- C. 페이지별 초기화 ---
    if (isScrapPage) initScrapFeature();
    if (isProfileDetailPage) initProfileDetailPage();
    
    // --- D. 아카이브 탭 전환 ---
    if (isArchivePage) { 
=======
// ----- 5. DOMContentLoaded (최종 버전) -----
document.addEventListener('DOMContentLoaded', () => {
    // 탭 입력 요소가 있으면 아카이브 페이지로 간주합니다.
    const tabInputs = document.querySelectorAll('input[name="archive-tab"]');
    const isArchivePage = tabInputs.length > 0;
    
    // 스크랩 버튼이 있으면 스크랩 페이지로 간주합니다.
    const submitBtn = document.getElementById('submit-scrap-btn');
    const isScrapPage = !!submitBtn;

    // --- A. 로그인 확인 ---
    const nicknameEl = document.getElementById('user-nickname');
    if (nicknameEl || isArchivePage || isScrapPage) { 
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        if (!userInfo) {
            alert('로그인이 필요한 페이지입니다.');
            window.location.href = 'login.html';
            return;
        }
        // 프로필 정보 설정 (nicknameEl이 있는 페이지에서만)
        const tagsEl = document.getElementById('user-tags');
        const followersEl = document.getElementById('user-followers');
        if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '사용자';
        if (tagsEl) tagsEl.textContent = (userInfo.topics && userInfo.topics.length > 0) ? userInfo.topics.map(t => `#${t}`).join(' ') : '#관심분야_없음';
        if (followersEl) followersEl.textContent = '팔로워 : 2023명 (dummy)';
    }

    // --- B. 스크랩 생성 기능 초기화 (create-scrap.html) ---
    if (isScrapPage) {
        initScrapFeature();
    }
    
    // --- C. 아카이브 페이지 기능 초기화 (archive.html) ---
    if (isArchivePage) { 
        // 탭 전환 및 렌더링 로직은 아카이브 페이지에서만 실행됩니다.
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');
        const fab = document.querySelector('.floating-action-button');

        tabInputs.forEach(input => {
            input.addEventListener('change', () => {
<<<<<<< HEAD
                // 3. 탭 변경 시 현재 상태를 세션에 저장
                sessionStorage.setItem('activeArchiveTab', input.value); 

=======
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
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
<<<<<<< HEAD
                    if (feedScrap) feedScrap.style.display = (input.value === 'scrap') ? 'flex' : 'none';
                    if (feedBookmark) feedBookmark.style.display = (input.value === 'bookmark') ? 'flex' : 'none';
=======

                    if (feedScrap) feedScrap.style.display = (input.value === 'scrap') ? 'block' : 'none';
                    if (feedBookmark) feedBookmark.style.display = (input.value === 'bookmark') ? 'block' : 'none';
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
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
<<<<<<< HEAD
    }
    
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }

    // 🚨 [핵심 추가] 기사 클릭 핸들러 (메인 & 프로필 공통)
    function handleArchiveArticleClick(e) {
        const card = e.target.closest('.article-card');
        
        // 북마크 버튼이 눌렸다면 이동 안 함
        if (e.target.closest('.bookmark-btn') || !card) return; 

        e.preventDefault(); 

        if (card.dataset.articleJson) {
            const rawData = JSON.parse(card.dataset.articleJson);
            
            const finalArticleData = {
                ...rawData,
                body: [
                    `✅ 기사 로드 성공: "${rawData.title}" (ID: ${rawData.id || 'N/A'})`,
                    "---",
                    "본문 내용은 스크랩/북마크 목록에서 가져온 데이터입니다.",
                    `출처: ${rawData.source}, 카테고리: ${rawData.category}`
                ],
                author: rawData.source || "OVERNEW 기자",
                date: rawData.time || "2025.11.21",
                mainImage: rawData.image || 'https://via.placeholder.com/400x300'
            };

            localStorage.setItem('selected_article', JSON.stringify(finalArticleData));
            window.location.href = 'article-detail.html'; 
        }
    }

    // 🚨 [리스너 등록] 아카이브 메인 페이지
    const feedScrap = document.getElementById('feed-scrap');
    const feedBookmark = document.getElementById('feed-bookmark');
    if (feedScrap) feedScrap.addEventListener('click', handleArchiveArticleClick);
    if (feedBookmark) feedBookmark.addEventListener('click', handleArchiveArticleClick);

    // 🚨 [리스너 등록] 프로필 상세 페이지 (여기가 중요!)
    const profileScrap = document.getElementById('profile-scrap-list');
    const profileBookmark = document.getElementById('profile-bookmark-list');
    if (profileScrap) profileScrap.addEventListener('click', handleArchiveArticleClick);
    if (profileBookmark) profileBookmark.addEventListener('click', handleArchiveArticleClick);

}); // DOMContentLoaded 종료
=======

        // 초기 렌더
        renderFeed();
    }
    // 기사 스크랩 페이지용 뒤로가기
const backButton = document.getElementById('back-button');
if (backButton) {
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });
}

});


>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
