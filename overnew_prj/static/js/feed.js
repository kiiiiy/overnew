// ====================
// 1. 카드 생성 함수 (데이터 심기)
// ====================

const CATEGORY_TO_TOPIC_CLASS = {
    'IT/과학': 'topic-it',
    '경제': 'topic-economy',
    '사회': 'topic-society',
    '정치': 'topic-politics',
    '생활/문화': 'topic-culture',
    '세계': 'topic-world',
    '연예': 'topic-enter',
    '스포츠': 'topic-sport',
};

// HOT 탭 카드
function createHotCardHTML(cardData) {
    const viewIconPath = '../../../static/image/view.png';
    const jsonString = JSON.stringify(cardData)
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');

    // 🔹 카테고리에 맞는 topic- 클래스 선택
    const topicClass =
        CATEGORY_TO_TOPIC_CLASS[cardData.category] || 'topic-default';

    return `
        <a href="#" class="article-card" data-article-json='${jsonString}'>
            <div class="card-text">
                <div class="card-meta-row">
                    <span class="card-category ${topicClass}">
                        ${cardData.category || ''}
                    </span>
                    <span class="card-source">
                        ${cardData.source || ''}
                    </span>
                </div>

                <h3 class="card-title">
                    ${cardData.title || ''}
                </h3>

                <div class="card-stats">
                    <span>
                        <img src="${viewIconPath}" alt="조회수" class="stat-icon">
                        ${cardData.views ?? 0}
                    </span>
                    <span>${cardData.time || ''}</span>
                </div>
            </div>

            <img src="${cardData.image || 'https://via.placeholder.com/100x60'}"
                 class="card-thumbnail">
        </a>
    `;
}

// FOLLOWING 탭 카드
function createFollowingCardHTML(userData, articleData) {
    const viewIconPath = '../../../static/image/view.png';
    const profilePath = '/account/profile/';
    const profileLink = `${profilePath}?user_id=${userData.id}`;

    // 북마크 체크
    const bookmarkedList =
        JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    const isBookmarked = bookmarkedList.some(
        item => item.id === articleData.id,
    );
    const activeClass = isBookmarked ? 'active' : '';

    // 카테고리 색 지정
    const topicClass =
        CATEGORY_TO_TOPIC_CLASS[articleData.category] || 'topic-default';

    // 데이터 stringify
    const jsonString = JSON.stringify(articleData)
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');

    return `
        <div class="following-card-group">
            <!-- 🔥 여기: '홍길동님이 열람한 기사입니다' 라벨 -->
            <div class="follower-read-label">
                <img src="${userData.profile_image || 'https://via.placeholder.com/32'}"
                     class="follower-avatar">
                <span>
                    <strong>${userData.nickname}</strong>님이 열람한 기사입니다
                </span>
            </div>

            <div class="article-card-wrapper" style="position: relative;">
                <a href="#" class="article-card" data-article-json='${jsonString}'>
                    <div class="card-text">
                        <div class="card-meta-row">
                            <span class="card-category ${topicClass}">
                                ${articleData.category || ''}
                            </span>
                            <span class="card-source">
                                ${articleData.source || ''}
                            </span>
                        </div>

                        <h3 class="card-title">
                            ${articleData.title || ''}
                        </h3>

                        <div class="card-stats">
                            <span>
                                <img src="${viewIconPath}" alt="조회수" class="stat-icon">
                                ${articleData.views ?? 0}
                            </span>
                            <span>${articleData.time || ''}</span>
                        </div>
                    </div>

                    <img src="${articleData.image || 'https://via.placeholder.com/100x60'}"
                         class="card-thumbnail">
                </a>

                <button
                    class="icon-btn bookmark-btn ${activeClass}"
                    data-article-json='${jsonString}'
                    style="
                        position: absolute;
                        bottom: 10px;
                        right: 10px;
                        z-index: 10;
                        background: rgba(255,255,255,0.8);
                        border-radius: 50%;
                    "
                >
                    <span>□</span>
                </button>
            </div>
        </div>
    `;
}



// ====================
// 2. 피드 렌더링 함수 (HOT/FOLLOWING 둘 다 카테고리 필터)
// ====================

async function renderFeedPage(view, topic) {
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');
    const container = view === 'hot' ? feedHot : feedFollowing;

    if (!container) return;

    container.innerHTML = '';
    let html = '';

    try {
        const params = new URLSearchParams();
        if (topic) {
            params.append('topic', topic); // politics / economy / sport ...
        }

        if (view === 'hot') {
            // 🔥 HOT 탭
            const response = await fetch(
                `/feed/api/hot/?${params.toString()}`,
            );
            if (!response.ok) {
                throw new Error('HOT API 호출 실패');
            }

            const data = await response.json();
            const articles = data.articles || [];

            if (articles.length > 0) {
                articles.forEach(a => {
                    html += createHotCardHTML(a);
                });
            } else {
                html =
                    '<p style="text-align:center; color:#888; margin-top:40px;">' +
                    '핫한 기사가 없습니다.' +
                    '</p>';
            }
        } else {
            // 👥 FOLLOWING 탭
            const response = await fetch(
                `/feed/api/following/?${params.toString()}`,
            );

            if (!response.ok) {
                if (response.status === 302 || response.redirected) {
                    // 백엔드에서 로그인 페이지로 리다이렉트할 경우
                    window.location.href = '/account/login/';
                    return;
                }
                throw new Error('FOLLOWING API 호출 실패');
            }

            const data = await response.json();
            const results = data.results || [];

            if (results.length > 0) {
                results.forEach(item => {
                    html += createFollowingCardHTML(item.user, item.article);
                });
            } else {
                html =
                    '<p style="text-align:center; color:#888; margin-top:60px;">' +
                    '팔로우한 유저들이<br>이 카테고리의 기사를 스크랩하지 않았어요.' +
                    '</p>';
            }
        }
    } catch (err) {
        console.error(err);
        html =
            '<p style="text-align:center; color:#e74c3c; margin-top:40px;">' +
            '피드를 불러오는 중 오류가 발생했습니다.' +
            '</p>';
    }

    container.innerHTML = html;
}



// ====================
// 3. 메인 로직 (이벤트 리스너)
// ====================

document.addEventListener('DOMContentLoaded', () => {
    const keywordList = document.getElementById('keyword-list-container');
    const viewHot = document.getElementById('view-hot');
    const viewFollowing = document.getElementById('view-following');
    const bottomNav = document.querySelector('.bottom-nav');
    const settingsBtn = document.getElementById('settings-menu-btn');
    const notifBtn = document.getElementById('notifications-btn');

    // 템플릿 파일용 경로 (지금 기존 코드랑 맞춰둠)
    const accountPath = '../../../account/templates/account/';
    const loginPath = accountPath + 'login.html';

    // 현재 뷰 / 현재 카테고리
    let currentView = viewHot && viewHot.checked ? 'hot' : 'following';
    let currentTopic = null; // 처음에는 전체 (필터 없음)

    // localStorage에 저장된 로그인 정보 (프론트 임시 세션)
    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    const isLoggedIn = !!(userInfo && userInfo.nickname);

    // --- 로그인 필요 기능 차단용 공통 함수 ---
    function requireLogin(e) {
        e.preventDefault();
        e.stopPropagation();

        if (viewHot) viewHot.checked = true;
        currentView = 'hot';
        currentTopic = null;
        renderFeedPage(currentView, currentTopic);

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'OVERNEW',
                text: '로그인이 필요한 기능이에요.',
                icon: 'warning',
                confirmButtonText: '로그인 하러가기',
                confirmButtonColor: '#6c5ce7',
            }).then(result => {
                if (result.isConfirmed) window.location.href = loginPath;
            });
        } else {
            alert('로그인이 필요합니다.');
            window.location.href = loginPath;
        }
    }

    // --- 비로그인 차단 ---
    if (!isLoggedIn) {
        if (viewFollowing)
            viewFollowing.addEventListener('click', requireLogin);
        if (bottomNav)
            bottomNav.addEventListener('click', requireLogin, true);
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

    if (feedHot) feedHot.style.display = currentView === 'hot' ? 'flex' : 'none';
    if (feedFollowing)
        feedFollowing.style.display = currentView === 'following' ? 'flex' : 'none';
    if (keywordList) keywordList.style.display = 'flex'; // 🔥 HOT/FOLLOWING 둘 다에서 카테고리 노출

    // 처음엔 모든 카테고리 (topic = null) 기준으로 HOT 렌더
    currentView = 'hot';
    currentTopic = null;
    if (viewHot) viewHot.checked = true;
    if (viewFollowing) viewFollowing.checked = false;

    renderFeedPage(currentView, currentTopic);

    // --- 탭 전환 ---
    if (viewHot) {
        viewHot.addEventListener('change', () => {
            if (!viewHot.checked) return;

            currentView = 'hot';
            // currentTopic은 그대로 두고, 선택된 카테고리 기준으로 HOT 필터링
            if (feedHot) feedHot.style.display = 'flex';
            if (feedFollowing) feedFollowing.style.display = 'none';

            renderFeedPage(currentView, currentTopic);
        });
    }

    if (viewFollowing) {
        viewFollowing.addEventListener('change', event => {
            if (!viewFollowing.checked) return;

            if (!isLoggedIn) {
                requireLogin(event);
                return;
            }

            currentView = 'following';

            if (feedHot) feedHot.style.display = 'none';
            if (feedFollowing) feedFollowing.style.display = 'flex';

            // FOLLOWING 탭 처음 들어갈 때, 선택된 태그가 없으면 '정치'로 기본 세팅
            if (!currentTopic) {
                const firstTag = document.querySelector('.keyword-tag');
                if (firstTag) {
                    currentTopic = firstTag.dataset.topic;
                    document
                        .querySelectorAll('.keyword-tag')
                        .forEach(t => t.classList.remove('active'));
                    firstTag.classList.add('active');
                }
            }

            renderFeedPage(currentView, currentTopic);
        });
    }

    // --- 카테고리 태그 클릭 ---
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic; // politics / economy ...

            document
                .querySelectorAll('.keyword-tag')
                .forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            renderFeedPage(currentView, currentTopic);
        });
    });

    // --- 햄버거 버튼: 마이페이지로 이동 ---
    if (settingsBtn) {
        settingsBtn.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = '/account/mypage/';
        });
    }

    // ============================================================
    // 4. 기사 클릭 및 북마크 이벤트 (통합 처리)
    // ============================================================
    function handleArticleClick(e) {
        // 1. 북마크 버튼 클릭
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            e.preventDefault();
            e.stopPropagation();

            const articleData = JSON.parse(
                bookmarkBtn.dataset.articleJson,
            );
            let bookmarks =
                JSON.parse(
                    localStorage.getItem('bookmarked_articles'),
                ) || [];
            const existingIndex = bookmarks.findIndex(
                item => item.id === articleData.id,
            );

            if (existingIndex !== -1) {
                bookmarks.splice(existingIndex, 1);
                bookmarkBtn.classList.remove('active');
                alert('북마크가 취소되었습니다.');
            } else {
                bookmarks.push(articleData);
                bookmarkBtn.classList.add('active');
                alert('기사가 북마크되었습니다!');
            }

            localStorage.setItem(
                'bookmarked_articles',
                JSON.stringify(bookmarks),
            );
            return;
        }

        // 2. 기사 카드 클릭
        const card = e.target.closest('.article-card');
        if (card) {
            e.preventDefault();

            let articleData = {};

            if (card.dataset.articleJson) {
                const rawData = JSON.parse(card.dataset.articleJson);
                const articleTitle = rawData.title || '제목 없음';

                articleData = {
                    ...rawData,
                    body: [
                        `✅ 현재 로드된 기사 제목: "${articleTitle}" (ID: ${rawData.id})`,
                        '---',
                        '본문 내용이 여기에 들어갑니다. (더미 텍스트)',
                        `출처: ${rawData.source}, 이 기사는 ${rawData.category} 주제에 속합니다.`,
                    ],
                    author: rawData.source || 'OVERNEW 기자',
                    date: rawData.time || '2025.11.21',
                    mainImage:
                        rawData.image ||
                        'https://via.placeholder.com/400x300',
                };
            }

            localStorage.setItem(
                'selected_article',
                JSON.stringify(articleData),
            );
            window.location.href =
                '../../../archive/templates/archive/article-detail.html';
        }
    }

    if (feedHot) feedHot.addEventListener('click', handleArticleClick);
    if (feedFollowing)
        feedFollowing.addEventListener('click', handleArticleClick);
});