// feed.js
// ====================
// 1. 데이터 영역
// ====================

// [HOT 탭용 데이터]
// ====================
// 2. 카드 생성 함수 (데이터 심기)
// ====================

function createHotCardHTML(cardData) {
    const viewIconPath = '../../../static/image/view.png'; 
    // 🚨 [핵심] 데이터 전체를 JSON 문자열로 변환해 HTML에 숨김
    const jsonString = JSON.stringify(cardData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

    return `
        <a href="#" class="article-card" data-article-json='${jsonString}'>
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

function createFollowingCardHTML(userData, articleData) {
    const viewIconPath = '../../../static/image/view.png'; 
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const profileLink = `${profilePath}?user_id=${userData.id}`;

    const bookmarkedList = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    const isBookmarked = bookmarkedList.some(item => item.id === articleData.id);
    const activeClass = isBookmarked ? 'active' : '';

    const jsonString = JSON.stringify(articleData).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

    return `
        <div class="following-card-group">
            <div class="follower-header">
                <a href="${profileLink}" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                    <img src="${userData.profile_image || 'https://via.placeholder.com/36x36'}" class="card-avatar-small">
                    <strong>${userData.nickname}</strong>님이 스크랩한 기사
                </a>
            </div>
            
            <div class="article-card-wrapper" style="position: relative;">
                <a href="#" class="article-card" data-article-json='${jsonString}'>
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
                
                <button class="icon-btn bookmark-btn ${activeClass}" 
                    data-article-json='${jsonString}'
                    style="position: absolute; bottom: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.8); border-radius: 50%;">
                    <span>□</span>
                </button>
            </div>
        </div>
    `;
}

// ====================
// 3. 피드 렌더링 함수
// ====================
async function renderFeedPage(view, topic) {
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');
    const container = view === 'hot' ? feedHot : feedFollowing;

    if (!container) return;

    container.innerHTML = '';
    let html = '';

    try {
        // 쿼리스트링 만들기 (?topic=politics 이런 거)
        const params = new URLSearchParams();
        if (topic) {
            params.append('topic', topic);   // politics / economy / sport ...
        }

        if (view === 'hot') {
            // 🔥 HOT 탭: /feed/api/hot/?topic=it 같은 형태로 호출
            const response = await fetch(`/feed/api/hot/?${params.toString()}`);
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
                html = '<p style="text-align:center; color:#888; margin-top:40px;">핫한 기사가 없습니다.</p>';
            }
        } else {
            // 👥 FOLLOWING 탭: /feed/api/following/?topic=politics
            const response = await fetch(`/feed/api/following/?${params.toString()}`);
            if (!response.ok) {
                // 로그인 안 된 상태에서 @login_required 걸려 있으면 리다이렉트 될 수 있음
                if (response.status === 302 || response.redirected) {
                    // 실제 로그인 URL에 맞게 수정해서 쓰면 됨
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
                html = '<p style="text-align:center; color:#888; margin-top:60px;">팔로우한 유저들이<br>이 카테고리의 기사를 스크랩하지 않았어요.</p>';
            }
        }
    } catch (err) {
        console.error(err);
        html = '<p style="text-align:center; color:#e74c3c; margin-top:40px;">피드를 불러오는 중 오류가 발생했습니다.</p>';
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

    // --- 로그인 체크 함수 ---
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

    // --- 비로그인 차단 ---
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

    // --- 초기 렌더링 ---
    const feedHot = document.getElementById('feed-hot');
    const feedFollowing = document.getElementById('feed-following');

    if (feedHot) feedHot.style.display = currentView === 'hot' ? 'flex' : 'none';
    if (feedFollowing) feedFollowing.style.display = currentView === 'following' ? 'flex' : 'none';
    if (keywordList) keywordList.style.display = 'flex';   

    renderFeedPage(currentView, currentTopic);

    // --- 탭 전환 ---
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

    // --- 키워드 태그 클릭 ---
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentTopic = tag.dataset.topic;
            document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeedPage(currentView, currentTopic);
        });
    });

    // --- 햄버거 버튼 ---
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.href = accountPath + 'settings-logged-in.html';
            else window.location.href = accountPath + 'settings-logged-out.html';
        });
    }

    // ============================================================
    // 5. [핵심] 기사 클릭 및 북마크 이벤트 (통합 처리)
    // ============================================================
    
    // 공통 처리 함수: 기사 클릭 시 상세페이지 이동
// 공통 처리 함수: 기사 클릭 시 상세페이지 이동 (★ 이 함수만 교체하세요)
    // 공통 처리 함수: 기사 클릭 시 상세페이지 이동 (★ 이 함수만 교체하세요)
    function handleArticleClick(e) {
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
            window.location.href = '../../../archive/templates/archive/article-detail.html';
        }
    }

    // 리스너 등록 (Hot, Following 둘 다 적용)
    if (feedHot) feedHot.addEventListener('click', handleArticleClick);
    if (feedFollowing) feedFollowing.addEventListener('click', handleArticleClick);

});