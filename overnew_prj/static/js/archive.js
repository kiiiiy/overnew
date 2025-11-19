// ----- 1. Dummy Data -----
const dummyScrapData = {
    scrap: {
        politics: [{ category: '정치', source: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'jung-chung-rae.jpg' }],
        economy: [{ category: '경제', source: 'SBS', title: 'APEC 효과?...', views: '32.6k', time: '4 hours ago', image: 'apec-market.jpg' }],
        society: [], it: [], culture: [], world: [], enter: [], sport: []
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
    { id: 'AnotherUser', nickname: 'Another User', tags: ['정치'], isFollowing: false, avatar: 'avatar-placeholder.png' }
];

// ----- 2. HTML 생성 함수 (카테고리 표시 및 스타일 클래스 최종 수정) -----
function createArticleCardHTML(cardData) {
    // data-topic 값(politics, economy 등 소문자 영문)과 표시할 한글 이름 매핑 (렌더링 시 사용)
    const topicDisplayMap = {
        'IT/과학': 'IT/과학', '경제': '경제', '사회': '사회', '정치': '정치', '연예': '연예', '스포츠': '스포츠', '생활/문화': '생활/문화', '세계': '세계',
        'Politics': '정치', 'Economy': '경제', 'Society': '사회', 'Culture': '생활/문화', 'It': 'IT/과학', 'World': '세계', 
        'Entertainment': '연예', 'Sports': '스포츠' 
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

function renderFollowingList(searchTerm = "") {
    const listContainer = document.getElementById('following-list');
    if (!listContainer) return; 
    
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
    const topicButtons = document.querySelectorAll('.topic-grid-button');
    const linkInput = document.getElementById('article-link');
    const clearLinkBtn = document.getElementById('clear-link-btn'); 
    const submitBtn = document.getElementById('submit-scrap-btn');
    
    // 언론사 관련 요소들
    const sourceInput = document.getElementById('article-source');
    const clearSourceBtn = document.getElementById('clear-source-btn');

    // 필수 요소 체크
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
        if (!savedScraps[selectedTopic]) savedScraps[selectedTopic] = [];
        savedScraps[selectedTopic].unshift(newArticle);
        localStorage.setItem('scrapped_articles', JSON.stringify(savedScraps));

        alert('기사가 스크랩되었습니다!');
        window.location.href = 'archive.html';
    });
}

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

        // 초기 렌더
        renderFeed();
    }
});


