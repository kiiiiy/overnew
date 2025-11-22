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

// 🌟 추가: 기사 상세 페이지 URL 생성 함수
function getArticleDetailUrl(articleId) {
    // article-detail.html?id=123 형식으로 URL을 생성합니다.
    return `article-detail.html?id=${articleId}`;
}

// ----- 2. HTML 생성 함수 (DB 데이터 형식에 맞게 수정) -----
function createArticleCardHTML(cardData) {
    // 🌟 수정: DB에서 반환되는 'category'와 'media' 필드 이름을 사용하도록 변경
    const topicDisplayMap = {
        'IT/과학': 'IT/과학', '경제': '경제', '사회': '사회', '정치': '정치', '연예': '연예', '스포츠': '스포츠', '생활/문화': '생활/문화', '세계': '세계',
    };

    const topicClassMap = {
        '정치': 'topic-politics', '경제': 'topic-economy', '사회': 'topic-society', '생활/문화': 'topic-culture', 'IT/과학': 'topic-it', '세계': 'topic-world',
        '연예': 'topic-enter', '스포츠': 'topic-sport'
    };

    // 🌟 수정: 'cardData.category'는 백엔드에서 온 한글 카테고리 이름입니다.
    const categoryText = cardData.category || '기타';
    const categoryClass = topicClassMap[categoryText] || 'topic-default';

    // 🌟 수정: href에 article_id를 포함하여 동적으로 URL 생성
    return `
        <a href="${getArticleDetailUrl(cardData.article_id)}" class="article-card">
            <div class="card-text">
                <span class="card-category ${categoryClass}">${categoryText}</span>
                <span class="card-source">${cardData.media}</span>
                <h3 class="card-title">${cardData.title}</h3>
                <div class="card-stats">
                    <span class="time">${new Date(cardData.scraped_at).toLocaleDateString()}</span>
                </div>
            </div>
            <img src="${cardData.image || 'image-placeholder.jpg'}" alt="${cardData.title}" class="card-thumbnail">
        </a>`;
}

// ... (createUserListItemHTML 함수는 유지 또는 삭제) ...

// ----- 3. 렌더링 함수 (API 연동) -----
async function renderFeed() { // 🌟 수정: async 키워드 추가
    const tabInput = document.querySelector('input[name="archive-tab"]:checked');
    if (!tabInput || tabInput.value !== 'scrap') return; // 북마크 탭은 일단 스킵

    const currentTopic = document.querySelector('#scrap-bookmark-content .keyword-tag.active').dataset.topic; // politics, economy 등
    const feedContainer = document.getElementById(`feed-scrap`);

    if (!feedContainer) return;

    feedContainer.innerHTML = '';

    // 1. 로그인된 사용자 ID 가져오기
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    // 🚨 중요: 여기서 user_id는 실제 DB에서 사용하는 ID여야 합니다. 
    // 가정: userInfo에 id 필드가 있습니다.
    const userId = userInfo ? userInfo.id : null;

    if (!userId) {
        feedContainer.innerHTML = '<p style="text-align: center; color: red; margin-top: 50px;">로그인이 필요합니다.</p>';
        return;
    }

    try {
        // 2. scrap_list API 호출
        const response = await fetch(`/archive/users/${userId}/scraps/`);
        const allArticles = await response.json();

        if (!response.ok) throw new Error(allArticles.error || '목록 로드 실패');

        // 3. 현재 선택된 토픽으로 필터링
        // 백엔드에서 온 'category' 필드는 한글 이름(예: '정치')이라고 가정합니다.
        const topicMap = {
            'politics': '정치', 'economy': '경제', 'society': '사회', 'culture': '생활/문화',
            'it': 'IT/과학', 'world': '세계', 'enter': '연예', 'sport': '스포츠'
        };
        const targetCategory = topicMap[currentTopic];

        const articles = allArticles.filter(
            article => article.category === targetCategory
        );

        if (articles.length === 0) {
            feedContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 50px;">[${targetCategory}] 주제의 스크랩 기사가 없습니다.</p>`;
            return;
        }

        // 4. DB 데이터로 카드 렌더링
        articles.forEach(article => {
            feedContainer.innerHTML += createArticleCardHTML(article);
        });

    } catch (error) {
        console.error('스크랩 목록 로드 실패:', error);
        feedContainer.innerHTML = '<p style="text-align: center; color: red; margin-top: 50px;">스크랩 목록을 불러오는 데 실패했습니다.</p>';
    }
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

// ----- 4. 기사 스크랩 기능 (API 연동으로 전면 수정) -----
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
            selectedTopic = button.dataset.topic; // politics, economy 등 소문자 영문 코드가 nc_id로 사용됨
        });
    });

    clearSourceBtn.addEventListener('click', () => { sourceInput.value = ''; });
    clearLinkBtn.addEventListener('click', () => { linkInput.value = ''; });

    // 🌟 수정: 스크랩 버튼 클릭 이벤트 -> API 호출 및 리다이렉트
    submitBtn.addEventListener('click', async () => {
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

        // 1. 로그인된 사용자 ID 가져오기
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const userId = userInfo ? userInfo.id : null; // 🚨 가정: 로그인 정보는 localStorage의 id 필드에 저장되어 있음

        if (!userId) {
            alert('로그인이 필요한 작업입니다.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '저장 중...';

        // 2. 백엔드 API 호출
        try {
            const response = await fetch('/archive/articles/upload/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    url: linkValue,
                    nc_id: selectedTopic, // views.py에서 nc_id로 사용
                    media_name: sourceValue,
                })
            });

            const result = await response.json();

            if (response.ok) {
                // 3. 응답으로 받은 article_id를 사용해 상세 페이지로 이동
                alert('기사가 성공적으로 스크랩되었습니다! 상세 페이지로 이동합니다.');
                window.location.href = getArticleDetailUrl(result.article_id); // 🌟 수정: 상세 페이지로 리다이렉트
            } else {
                alert(`스크랩 실패: ${result.error}`);
            }

        } catch (error) {
            console.error('스크랩 API 호출 중 오류 발생:', error);
            alert('서버와의 통신에 문제가 발생했습니다.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '업로드하기';
        }
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
                    if (fab) fab.style.display = 'none';
                    renderFollowingList();
                } else {
                    if (scrapBookmarkContent) scrapBookmarkContent.style.display = 'block';
                    if (followingContent) followingContent.style.display = 'none';
                    if (fab) fab.style.display = 'flex';

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
    // 기사 스크랩 페이지용 뒤로가기
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        // 1. URL에서 article_id 추출
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            console.error('기사 ID가 URL에서 누락되었습니다.');
            return;
        }

        try {
            // 2. 기사 상세 정보 API 호출 (views.py의 get_article_detail_api 호출)
            const response = await fetch(`/archive/api/articles/${articleId}/`);
            const article = await response.json();

            if (!response.ok) throw new Error(article.error || '기사 상세 정보 로드 실패');

            // 3. Iframe에 원본 URL 설정
            const iframe = document.createElement('iframe');
            iframe.id = 'article-iframe';
            iframe.src = article.url; // 👈 DB에서 가져온 원본 URL을 설정
            iframe.style.width = '100%';
            iframe.style.minHeight = '1000px';
            iframe.style.border = 'none';

            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                // 기존 콘텐츠를 지우고 iframe 삽입 (또는 특정 위치에 삽입)
                articleContent.innerHTML = '';
                articleContent.appendChild(iframe);
            }

            // 4. 페이지 제목 업데이트
            document.title = article.title + ' - OVERNEW';

        } catch (error) {
            console.error('기사 로드 실패:', error);
            // 사용자에게 에러 메시지 표시
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                articleContent.innerHTML = '<p style="padding: 20px; text-align: center;">기사 정보를 불러오는 데 실패했습니다.</p>';
            }
        }
    });

});


