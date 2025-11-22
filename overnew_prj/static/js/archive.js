// archive.js 파일 맨 위에 추가
const sessionInfo = {};
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
// [archive.js] 3. 렌더링 함수 - renderFeed 수정

async function renderFeed() {
    const tabInput = document.querySelector('input[name="archive-tab"]:checked');
    if (!tabInput) return;

    const currentTab = tabInput.value; // 'scrap' or 'bookmark'
    const feedContainer = document.getElementById(`feed-${currentTab}`);
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    let articles = [];

    // 🚨 [핵심] 로컬 스토리지 대신 Django API 호출
    if (currentTab === 'scrap') {
        const userId = 1; // 👈 현재 로그인된 사용자 ID를 동적으로 가져와야 함 (예: context에서 받은 값을 전역 변수에 저장)
        const apiUrl = `/archive/users/${userId}/scraps/`; // urls.py에 정의된 URL 사용

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            // Django view에서 JsonResponse로 반환한 데이터(article list)를 받습니다.
            const data = await response.json(); 
            articles = data.map(item => ({
                // Django API 응답 형식에 맞춰 Front-end card data 형식으로 변환
                id: item.article_id,
                category: item.category,
                source: item.media, // media 필드를 source로 사용
                title: item.title,
                views: 'N/A', // Django API에 조회수 필드가 없으면 N/A 처리
                time: item.scraped_at, // 스크랩 시각 사용
                image: item.image,
                // article-card의 data-article-json에 들어갈 정보도 추가
                topic: item.category, 
                summary: item.summary
            }));

        } catch (error) {
            console.error("스크랩 피드 로드 실패:", error);
            feedContainer.innerHTML = '<p style="text-align: center; color: red; margin-top: 50px;">데이터 로드 실패.</p>';
            return;
        }
    } 
    // else if (currentTab === 'bookmark') { ... (북마크 API 연결 로직) }


    // 렌더링 (기존 로직 유지)
    if (articles.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 탭의 기사가 없습니다.</p>';
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

    if (clearSourceBtn) clearSourceBtn.addEventListener('click', () => { sourceInput.value = ''; });
    if (clearLinkBtn) clearLinkBtn.addEventListener('click', () => { linkInput.value = ''; });

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

        if (!savedScraps[selectedTopic]) savedScraps[selectedTopic] = [];
        savedScraps[selectedTopic].unshift(newArticle);
        localStorage.setItem('scrapped_articles', JSON.stringify(savedScraps));

        alert('기사가 스크랩되었습니다!');
        window.location.href = '/archive/scrap/create/';

    });
}


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
        const userInfo = JSON.parse(localStorage.getItem('user-info')) || null;

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
    document.getElementById('scrap-btn').addEventListener('click', () => {
    window.location.href = '/archive/scrap/create/';
});


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
        const scrapBookmarkContent = document.getElementById('scrap-bookmark-content');
        const followingContent = document.getElementById('following-content');
        const fab = document.querySelector('.floating-action-button');

        tabInputs.forEach(input => {
            input.addEventListener('change', () => {
                // 3. 탭 변경 시 현재 상태를 세션에 저장
                sessionStorage.setItem('activeArchiveTab', input.value);

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
                    if (feedScrap) feedScrap.style.display = (input.value === 'scrap') ? 'flex' : 'none';
                    if (feedBookmark) feedBookmark.style.display = (input.value === 'bookmark') ? 'flex' : 'none';
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