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

// ----- 2. HTML 생성 함수 -----
function createArticleCardHTML(cardData) {
    const topicClassMap = { 'IT/과학': 'topic-it', '경제': 'topic-economy', '사회': 'topic-society', '정치': 'topic-politics', '연예': 'topic-enter', '스포츠': 'topic-sport', '생활/문화': 'topic-culture', '세계': 'topic-world' };
    const categoryClass = topicClassMap[cardData.category] || 'topic-default';
    return `
        <a href="article-detail.html" class="article-card">
            <div class="card-text">
                <span class="card-category ${categoryClass}">${cardData.category}</span>
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

// ----- 3. 렌더링 함수 -----
function renderFeed() {
    const currentTab = document.querySelector('input[name="archive-tab"]:checked').value;
    const currentTopic = document.querySelector('#scrap-bookmark-content .keyword-tag.active').dataset.topic;

    const feedScrap = document.getElementById('feed-scrap');
    const feedBookmark = document.getElementById('feed-bookmark');

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

// ----- 4. 기사 스크랩 기능 -----
function initScrapFeature() {
    const topicButtons = document.querySelectorAll('.topic-grid-button');
    const linkInput = document.getElementById('article-link');
    const clearBtn = document.getElementById('clear-link-btn');
    const submitBtn = document.getElementById('submit-scrap-btn');

    if (!topicButtons.length || !linkInput || !submitBtn) return; // scrap.html 전용

    let selectedTopic = null;

    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTopic = button.dataset.topic;
        });
    });

    clearBtn.addEventListener('click', () => {
        linkInput.value = '';
    });

    submitBtn.addEventListener('click', () => {
        const linkValue = linkInput.value.trim();
        if (!selectedTopic) {
            alert('기사의 분야(토픽)를 1개 선택해주세요.');
            return;
        }
        if (!linkValue) {
            alert('기사 링크를 입력해주세요.');
            return;
        }

        let savedScraps = JSON.parse(localStorage.getItem('scrapped_articles')) || {};
        const newArticle = {
            category: selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1),
            source: '외부기사',
            title: linkValue,
            views: '0k',
            time: 'Just now',
            image: 'image-placeholder.jpg'
        };

        if (!savedScraps[selectedTopic]) savedScraps[selectedTopic] = [];
        savedScraps[selectedTopic].unshift(newArticle);
        localStorage.setItem('scrapped_articles', JSON.stringify(savedScraps));

        alert('기사가 스크랩되었습니다!');
        window.location.href = 'archive.html';
    });
}

// ----- 5. DOMContentLoaded -----
document.addEventListener('DOMContentLoaded', () => {
    // 로그인 확인 및 프로필 정보
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }
    const nicknameEl = document.getElementById('user-nickname');
    const tagsEl = document.getElementById('user-tags');
    const followersEl = document.getElementById('user-followers');
    if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '사용자';
    if (tagsEl) tagsEl.textContent = (userInfo.topics && userInfo.topics.length > 0) ? userInfo.topics.map(t => `#${t}`).join(' ') : '#관심분야_없음';
    if (followersEl) followersEl.textContent = '팔로워 : 2023명 (dummy)';

    // 탭 전환
    const tabInputs = document.querySelectorAll('input[name="archive-tab"]');
    const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
    const followingContent = document.getElementById('following-content');
    const fab = document.querySelector('.floating-action-button');

    tabInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'following') {
                scrapBookmarkContent.style.display = 'none';
                followingContent.style.display = 'block';
                if(fab) fab.style.display = 'none';
                renderFollowingList();
            } else {
                scrapBookmarkContent.style.display = 'block';
                followingContent.style.display = 'none';
                if(fab) fab.style.display = 'flex';
                document.getElementById('feed-scrap').style.display = (input.value === 'scrap') ? 'block' : 'none';
                document.getElementById('feed-bookmark').style.display = (input.value === 'bookmark') ? 'block' : 'none';
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
    initScrapFeature(); // scrap 기능 초기화
});
