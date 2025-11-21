// ----- 1. Dummy Data -----
// 주의: dummyAllUsers 데이터는 JavaScript가 실행될 때마다 초기 상태로 돌아갑니다.
// 실제 앱에서는 서버나 localStorage에 저장해야 상태가 영구적으로 유지됩니다.
const dummyScrapData = {
    scrap: {
        politics: [{ category: '정치', source: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'jung-chung-rae.jpg' }],
        economy: [{ category: '경제', source: 'SBS', title: 'APEC 효과?...', views: '32.6k', time: '4 hours ago', image: 'apec-market.jpg' }],
        society: [], it: [], 
        culture: [{ category: '생활/문화', source: '문화일보', title: '생활 문화 뉴스입니다.', views: '1.2k', time: '1일 전', image: 'image-placeholder.jpg' }], 
        world: [{ category: '세계', source: 'CNN', title: '해외 주요 소식입니다.', views: '5.5k', time: '5시간 전', image: 'image-placeholder.jpg' }],     
        enter: [], sport: [] 
    },
    bookmark: {
        politics: [{ category: '정치', source: '뉴스웍스', title: "북마크한 정치 기사입니다.", views: '31.9k', time: '5 hours ago', image: 'lg-cns-award.jpg' }],
        economy: [], society: [], it: [], culture: [], world: [], enter: [], sport: []
    }
};

const dummyAllUsers = [
    { id: 'ByeWind', nickname: 'ByeWind', tags: ['IT/과학', '문화'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Natali', nickname: 'Natali Craig', tags: ['경제', 'it'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Drew', nickname: 'Drew Cano', tags: ['문화'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Orlando', nickname: 'Orlando Diggs', tags: ['경제'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'Andi', nickname: 'Andi Lane', tags: ['it', '스포츠', '경제'], isFollowing: true, avatar: 'avatar-placeholder.png' },
    { id: 'NonFollow', nickname: 'Non Follow User', tags: ['사회'], isFollowing: false, avatar: 'avatar-placeholder.png' },
    { id: 'AnotherUser', nickname: 'Another User', tags: ['정치'], isFollowing: false, avatar: 'avatar-placeholder.png' },
// 🚨 [추가] 추천 페이지(main.js)에 있던 유저 ID들을 여기에 추가해야 매칭이 됩니다!
    { id: 'kwon', nickname: '권또또', tags: ['정치', '사회'], avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권' },
    { id: 'leftgabi', nickname: '왼가비', tags: ['경제'], avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼' },
    { id: 'kimlinky', nickname: '김링키', tags: ['경제'], avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김' }
];

// ----- 2. HTML 생성 함수 -----
function createArticleCardHTML(cardData) {
    const topicDisplayMap = {
        'IT/과학': 'IT/과학', '경제': '경제', '사회': '사회', '정치': '정치', '연예': '연예', '스포츠': '스포츠', '생활/문화': '생활/문화', '세계': '세계',
        'Politics': '정치', 'Economy': '경제', 'Society': '사회', 'Culture': '생활/문화', 'It': 'IT/과학', 'World': '세계', 
        'Enter': '연예', 'Sport': '스포츠' 
    };
    
    const topicClassMap = { 
        'IT/과학': 'topic-it', '경제': 'topic-economy', '사회': 'topic-society', '정치': 'topic-politics', '연예': 'topic-enter', '스포츠': 'topic-sport', '생활/문화': 'topic-culture', '세계': 'topic-world', 
        'Politics': 'topic-politics', 'Economy': 'topic-economy', 'Society': 'topic-society', 'Culture': 'topic-culture', 'It': 'topic-it', 'World': 'topic-world', 
        'Enter': 'topic-enter', 'Sport': 'topic-sport' 
    };

    const categoryText = topicDisplayMap[cardData.category] || cardData.category;
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';

    const cardSource = cardData.source || "출처 정보 없음"; 
    const cardTitle = cardData.title || "제목 정보 없음";
    const cardViews = cardData.views || "0k";
    const cardTime = cardData.time || "방금 전";

    return `
        <a href="article-detail.html" class="article-card">
            <div class="card-text">
                <span class="card-category ${categoryClass}">${categoryText}</span>
                <span class="card-source">${cardSource}</span>
                <h3 class="card-title">${cardTitle}</h3>
                <div class="card-stats">
                    <span class="views">👁️ ${cardViews}</span>
                    <span class="time">${cardTime}</span>
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
            <button type="button" class="follow-toggle-btn ${followingClass}" data-user-id="${userData.id}" data-is-following="${userData.isFollowing}">
                ${buttonText}
            </button>
        </div>`;
}

// ----- 3. 렌더링 함수 (오류 방지 코드 포함) -----
function renderFeed() {
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
        articles = savedTopicArticles.concat(defaultArticles); 
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

// archive.js 내부 함수 교체

function renderFollowingList(searchTerm = "") {
    const listContainer = document.getElementById('following-list');
    if (!listContainer) return; 
    
    // 1. 로컬 스토리지 동기화
    let realFollowingList = JSON.parse(localStorage.getItem('following_list')) || [];
    dummyAllUsers.forEach(user => {
        user.isFollowing = realFollowingList.includes(user.id);
    });

    // 2. 필터링 (🚨 닉네임만 검색되도록 수정됨)
    const normalizedSearch = searchTerm.toLowerCase();
    
    let usersToShow = dummyAllUsers.filter(user => {
        if (searchTerm) {
            // 🚨 [수정] user.id 검색 조건 삭제함 -> 오직 닉네임만 확인
            return user.nickname.toLowerCase().includes(normalizedSearch);
        } else {
            // 검색어 없으면 팔로잉 중인 사람만
            return user.isFollowing;
        }
    });

    // 3. 정렬 (팔로우한 사람을 위로)
    usersToShow.sort((a, b) => {
        if (a.isFollowing === b.isFollowing) return 0;
        return a.isFollowing ? -1 : 1;
    });

    // 4. 화면 그리기
    listContainer.innerHTML = ''; 

    if (usersToShow.length === 0) {
        const msg = searchTerm ? '일치하는 사용자가 없습니다.' : '팔로잉 중인 사용자가 없습니다.';
        listContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 50px;">${msg}</p>`;
        return;
    }
    
    usersToShow.forEach(user => {
        listContainer.innerHTML += createUserListItemHTML(user);
    });

    // 5. 버튼 이벤트 연결
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
            
            // 검색 상태 유지하면서 리스트 갱신
            renderFollowingList(searchTerm); 
        });
    });
}

// ⭐⭐ 새로운 함수: 프로필 상세 페이지 초기화 함수 ⭐⭐
function initProfileDetailPage() {
    const followBtn = document.getElementById('profile-follow-btn');
    const profileNicknameEl = document.getElementById('profile-nickname');
    const profileTagsEl = document.getElementById('profile-tags');
    const profileFollowersEl = document.getElementById('profile-followers');

    if (!followBtn || !profileNicknameEl) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('user_id') || 'Natali'; 
    const targetUser = dummyAllUsers.find(u => u.id === targetUserId);

    if (!targetUser) {
        profileNicknameEl.textContent = "사용자 없음";
        followBtn.style.display = 'none'; 
        return;
    }
    
    // 버튼 텍스트와 스타일을 상태에 맞게 업데이트하는 함수
    const updateFollowButton = () => {
        if (targetUser.isFollowing) {
            followBtn.textContent = '언팔로우';
            followBtn.classList.add('followed');
            followBtn.classList.remove('not-followed');
        } else {
            followBtn.textContent = '팔로우';
            followBtn.classList.add('not-followed');
            followBtn.classList.remove('followed');
        }
    };

    // 프로필 정보 설정 및 버튼 초기화
    profileNicknameEl.textContent = targetUser.nickname;
    if (profileTagsEl) profileTagsEl.textContent = targetUser.tags.map(t => `#${t}`).join(' ');
    if (profileFollowersEl) profileFollowersEl.textContent = `팔로워: ${targetUser.id.length * 100}명 (dummy)`; 
    updateFollowButton();


    // 버튼 클릭 이벤트: 팔로우 상태 토글
    followBtn.addEventListener('click', () => {
        targetUser.isFollowing = !targetUser.isFollowing; 
        updateFollowButton(); // 버튼 업데이트
    });

    // ⭐ 프로필 상세 페이지 탭 전환 및 렌더링 로직 (추가) ⭐
    const tabInputs = document.querySelectorAll('input[name="profile-tab"]');
    const keywordTags = document.querySelectorAll('.keyword-list .keyword-tag'); 
    
    const renderProfileFeed = () => {
        const currentTab = document.querySelector('input[name="profile-tab"]:checked').value;
        const activeTag = document.querySelector('.keyword-list .keyword-tag.active');
        const currentTopic = activeTag ? activeTag.dataset.topic : 'politics';
        
        const listContainer = document.getElementById(`profile-${currentTab}-list`);
        
        let articles = [];
        if (currentTab === 'scrap') {
             articles = dummyScrapData.scrap[currentTopic] || [];
        } else if (currentTab === 'bookmark') {
             articles = dummyScrapData.bookmark[currentTopic] || [];
        }

        if (!listContainer) return;
        listContainer.innerHTML = '';
        
        if (articles.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 20px;">이 주제의 기사가 없습니다.</p>';
            return;
        }
        articles.forEach(article => {
            listContainer.innerHTML += createArticleCardHTML(article);
        });
    };
    
    // 탭 이벤트 연결
    tabInputs.forEach(input => {
        input.addEventListener('change', () => {
            document.getElementById('content-scrap').style.display = (input.value === 'scrap') ? 'block' : 'none';
            document.getElementById('content-bookmark').style.display = (input.value === 'bookmark') ? 'block' : 'none';
            renderProfileFeed();
        });
    });
    
    // 키워드 태그 이벤트 연결
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


// ----- 4. 기사 스크랩 기능 (생략) -----
function initScrapFeature() { 
    const topicButtons = document.querySelectorAll('.topic-grid-button');
    const linkInput = document.getElementById('article-link');
    const clearLinkBtn = document.getElementById('clear-link-btn'); 
    const submitBtn = document.getElementById('submit-scrap-btn');
    
    const sourceInput = document.getElementById('article-source');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    if (!topicButtons.length || !linkInput || !submitBtn || !sourceInput || !clearLinkBtn || !clearSourceBtn) {
        return; 
    }

    let selectedTopic = null;

    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTopic = button.dataset.topic;
        });
    });

    clearSourceBtn.addEventListener('click', () => {
        sourceInput.value = ''; 
    });

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
        const capitalizedCategory = selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1);
        
        const newArticle = {
            category: capitalizedCategory,
            source: sourceValue || '외부기사', 
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


// ----- 5. DOMContentLoaded (최종 버전) -----
document.addEventListener('DOMContentLoaded', () => {
    const tabInputs = document.querySelectorAll('input[name="archive-tab"]');
    const isArchivePage = tabInputs.length > 0;
    
    const submitBtn = document.getElementById('submit-scrap-btn');
    const isScrapPage = !!submitBtn;

    const isProfileDetailPage = document.title.includes('프로필');

    // --- A. 로그인 확인 ---
    const nicknameEl = document.getElementById('user-nickname');
    if (nicknameEl || isArchivePage || isScrapPage || isProfileDetailPage) { 
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        if (!userInfo) {
            alert('로그인이 필요한 페이지입니다.');
            window.location.href = '../../../account/templates/account/login.html';
            return;
        }
        const tagsEl = document.getElementById('user-tags');
        const followersEl = document.getElementById('user-followers');
        if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '사용자';
        if (tagsEl) tagsEl.textContent = (userInfo.topics && userInfo.topics.length > 0) ? userInfo.topics.map(t => `#${t}`).join(' ') : '#관심분야_없음';
        if (followersEl) followersEl.textContent = '팔로워 : 2023명 (dummy)';
    }
    
    // --- B. 뒤로 가기 시 탭 상태 강제 복원 로직 ---
    const activeArchiveTab = document.querySelector('input[name="archive-tab"]:checked');
    
    if (isArchivePage && activeArchiveTab) {
        
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');

        if (activeArchiveTab.value === 'following') {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'none';
            if (followingContent) followingContent.style.display = 'block';
            
            if (typeof renderFollowingList === 'function') {
                renderFollowingList(document.getElementById('search-user')?.value || "");
            }
        } else {
            if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'block';
            if (followingContent) followingContent.style.display = 'none';
            
            if (typeof renderFeed === 'function') {
                renderFeed();
            }
        }
    }
    // ------------------------------------------

    // --- C. 스크랩 생성 기능 초기화 (create-scrap.html) ---
    if (isScrapPage) {
        initScrapFeature();
    }
    
    // --- D. 프로필 상세 페이지 초기화 (profile-detail.html) ---
    if (isProfileDetailPage) {
        initProfileDetailPage();
    }
    
    // --- E. 아카이브 페이지 기능 초기화 (archive.html) ---
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
        
        // 뒤로가기 복원 로직이 초기 렌더링을 담당했으므로, 여기서 다시 호출하지 않습니다.
        // renderFeed(); 
    }
    
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
});
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
});
