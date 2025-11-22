//연동 후 
// ============================================================
// 1. 서버 데이터 로드 및 렌더링
// ============================================================

// recommend.js 파일 상단에 추가
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 서버 API 엔드포인트 (urls.py 설정과 일치해야 함)
// 예: /recommend/api/recommend (앱 이름이 recommend라면)
const API_URL = 'http://127.0.0.1:8000/recommend/api/recommend/'; 

// [핵심] 서버에서 데이터를 가져와 화면에 그리는 함수
async function fetchAndRenderFeed(viewType) {
    const feedContainer = document.getElementById(viewType === 'similar' ? 'feed-similar' : 'feed-opposite');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '<p style="text-align:center; margin-top:50px;">로딩 중...</p>';

    // 1. 내 관심사 가져오기 (localStorage) - API 요청 시 토픽 전달용
    const myInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    // 내 관심사 중 첫 번째 것을 대표로 서버에 보냄 (또는 서버가 알아서 처리하게 할 수도 있음)
    // 여기서는 views.py 로직에 맞춰 'politics' 등 영어 토픽 하나를 보낸다고 가정
    const myTopics = myInfo.topics || ['politics']; 
    const currentTopic = myTopics[0] || 'politics'; 
    
    // 한글->영어 매핑이 필요하다면 여기서 변환 (백엔드가 영어를 받는다고 가정)
    const topicKoToEn = { '정치': 'politics', '경제': 'economy', '사회': 'society', '생활/문화': 'culture', 'IT/과학': 'it', '세계': 'world', '연예': 'enter', '스포츠': 'sport' };
    const topicParam = topicKoToEn[currentTopic] || currentTopic;

    try {
        // 2. 서버에 API 요청 보내기 (GET)
        // 예: /recommend/api/recommend?type=similar&topic=politics
        const response = await fetch(`${API_URL}?type=${viewType}&topic=${topicParam}`);
        
        if (!response.ok) {
            if (response.status === 401) {
                alert('로그인이 필요합니다.');
                window.location.href = '../../../account/templates/account/login.html';
                return;
            }
            throw new Error('서버 오류 발생');
        }

        const data = await response.json(); // { politics: [ {user:..., articles:...}, ... ] }
        
        // 3. 받아온 데이터 파싱
        // views.py가 { topic_name: [ ... ] } 형태로 보내므로, 해당 키로 배열을 꺼냄
        const userGroups = data[topicParam] || [];

        feedContainer.innerHTML = '';

        if (userGroups.length === 0) {
            feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">추천할 유저가 없습니다.</p>';
            return;
        }

        // 4. 화면 그리기
        let allGroupsHTML = '';
        userGroups.forEach(groupData => {
            // 백엔드 데이터 구조에 맞춰 매핑
            // groupData: { user: '닉네임', avatar: '...', userId: 'username', articles: [...], isFollowed: true/false }
            
            // 내가 이미 팔로우한 사람은 프론트에서 한 번 더 거를 수도 있음 (선택 사항)
            // 여기서는 서버가 isFollowed를 보내주므로 그걸 활용
            
            allGroupsHTML += createUserGroupHTML(groupData);
        });
        
        feedContainer.innerHTML = allGroupsHTML;
        
        // 버튼 이벤트 다시 연결
        addFollowButtonListeners();

    } catch (error) {
        console.error('Feed Load Error:', error);
        feedContainer.innerHTML = '<p style="text-align: center; color: red; margin-top: 50px;">데이터를 불러오지 못했습니다.</p>';
    }
}


// ============================================================
// 2. HTML 생성 함수
// ============================================================
function createUserGroupHTML(groupData) {
    // 경로 설정
    const profilePath = '../../../archive/templates/archive/profile-detail.html';
    const articlePath = '../../../archive/templates/archive/article-detail.html';
    
    const profileLink = `${profilePath}?user_id=${groupData.userId}`;
    
    // 팔로우 상태 확인 (서버가 준 isFollowed 값 사용)
    const isFollowed = groupData.isFollowed; 
    const btnClass = isFollowed ? 'followed' : '';
    const btnText = isFollowed ? '팔로잉' : '팔로우';

    let articlesHTML = '';
    
    // 기사 목록 순회
    if (groupData.articles && groupData.articles.length > 0) {
        groupData.articles.forEach(article => {
            const articleDetailLink = `${articlePath}?id=${article.id}`;
            
            // 이미지 처리 (서버가 이미지를 안 주면 기본 이미지)
            const imgSrc = article.image || 'https://via.placeholder.com/100x60';
            
            // 반응(스크랩수/댓글수) 표시
            let reactionHTML = '';
            if (article.reactions) reactionHTML = `<span class="meta-count">🔥 ${article.reactions}</span>`;
            else if (article.comments) reactionHTML = `<span class="meta-comments">💬 ${article.comments}</span>`;

            // 기사 데이터 JSON으로 심기 (클릭 시 이동용)
            const jsonString = JSON.stringify({
                id: article.id,
                title: article.title,
                source: article.source,
                // 필요한 추가 정보들...
            }).replace(/'/g, "&#39;").replace(/"/g, "&quot;");

            articlesHTML += `
            <div class="user-article">
                <a href="#" class="card-image-link article-click-target" data-article-json='${jsonString}'>
                    <img src="${imgSrc}" alt="${article.title}" class="card-image">
                </a>
                <div class="card-content">
                    <a href="#" class="card-title-link article-click-target" data-article-json='${jsonString}'>
                        <h3 class="card-title">${article.title}</h3>
                    </a>
                    <div class="card-meta">
                        <span class="card-source">${article.source || '뉴스'}</span>
                        <span class="card-reactions">${reactionHTML}</span>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        articlesHTML = '<div class="no-article" style="padding:10px; color:#999;">최근 활동 없음</div>';
    }

    return `
    <div class="user-feed-group">
        <div class="user-feed-header">
            <a href="${profileLink}" class="user-profile-link" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                <img src="${groupData.avatar}" alt="${groupData.user}" class="card-avatar">
                <span class="card-username">${groupData.user}</span>
            </a>
            <button class="follow-btn ${btnClass}" data-userid="${groupData.userId}">
                ${btnText}
            </button>
        </div>
        ${articlesHTML}
    </div>
    `;
}


// ============================================================
// 3. 팔로우 버튼 이벤트 (서버 연동 필요)
// ============================================================
function addFollowButtonListeners() {
    const followButtons = document.querySelectorAll('.follow-btn');
    
    // 🌟 서버 API 엔드포인트는 실제 Django urls.py에 정의된 주소로 바꿔주세요.
    // 예시: /users/api/follow_toggle/
    const API_ENDPOINT = 'http://127.0.0.1:8000/users/api/follow_toggle/'; 
    const csrfToken = getCookie('csrftoken'); // 🌟 파일 맨 위의 getCookie 함수를 사용

    followButtons.forEach(button => {
        if (button.dataset.listenerAdded === "true") return;

        button.addEventListener('click', async () => {
            const userIdToFollow = button.dataset.userid;
            const isCurrentlyFollowed = button.classList.contains('followed');
            
            // 1. UI 즉시 반영 (낙관적 업데이트) - 일단 바꿉니다.
            if (isCurrentlyFollowed) {
                button.classList.remove('followed');
                button.textContent = '팔로우';
            } else {
                button.classList.add('followed');
                button.textContent = '팔로잉';
            }

            // 2. 서버에 팔로우 요청 보내기 (수정됨)
            try {
                const response = await fetch(API_ENDPOINT, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken, // ⬅️ CSRF 토큰을 헤더에 추가
                    },
                    body: JSON.stringify({ 
                        user_id: userIdToFollow,
                        // 현재 상태를 반대로 만들어 서버에 전달 (Follow 요청이면 Unfollow 요청으로)
                        action: isCurrentlyFollowed ? 'unfollow' : 'follow' 
                    })
                });

                if (!response.ok) {
                    // 4xx 또는 5xx 에러 발생 시 throw
                    throw new Error('서버 처리 오류 발생');
                }

                // 🌟 서버 응답 성공: 로컬 스토리지 업데이트를 확정하고 다음 로직으로 진행합니다.

            } catch (e) {
                console.error('팔로우 요청 실패:', e);
                alert('팔로우 처리 실패. 네트워크 또는 서버를 확인하세요.');
                
                // 3. 🚨 실패 시 UI 원상복구 (낙관적 업데이트 되돌리기)
                // 현재 상태 (isCurrentlyFollowed)를 기준으로 UI를 다시 되돌립니다.
                if (isCurrentlyFollowed) {
                    // 원래 '팔로잉'이었으므로 되돌립니다.
                    button.classList.add('followed');
                    button.textContent = '팔로잉';
                } else {
                    // 원래 '팔로우'였으므로 되돌립니다.
                    button.classList.remove('followed');
                    button.textContent = '팔로우';
                }
                
                // 🚨 서버 요청이 실패했으므로, 아래 로컬 스토리지 업데이트 로직을 실행하지 않도록 
                // 여기서 함수 실행을 종료합니다.
                return;
            }
            
            // 4. 서버 응답 성공 시에만 로컬 스토리지 업데이트 (수정된 위치)
            let followingList = JSON.parse(localStorage.getItem('following_list')) || [];
            if (isCurrentlyFollowed) {
                // 언팔로우 성공: 리스트에서 제거
                followingList = followingList.filter(id => id !== userIdToFollow);
            } else {
                // 팔로우 성공: 리스트에 추가
                if (!followingList.includes(userIdToFollow)) followingList.push(userIdToFollow);
            }
            localStorage.setItem('following_list', JSON.stringify(followingList));
        });
        
        button.dataset.listenerAdded = "true";
    });
}

// ============================================================
// 4. 기사 클릭 핸들러 (상세 페이지 이동)
// ============================================================
function handleRecommendArticleClick(e) {
    const target = e.target.closest('.article-click-target');
    if (!target) return;

    e.preventDefault();

    if (target.dataset.articleJson) {
        const rawData = JSON.parse(target.dataset.articleJson);
        
        // 상세 페이지용 데이터 생성
        const finalArticleData = {
            ...rawData,
            category: '추천뉴스', // 혹은 rawData.category
            body: [
                `✅ 기사 제목: "${rawData.title}"`,
                "---",
                "본문 내용이 여기에 들어갑니다. (서버 연동 필요)"
            ],
            author: rawData.source || "기자",
            date: "2025.11.22", // 실제 데이터 있으면 그것 사용
            mainImage: 'https://via.placeholder.com/400x300' // 이미지 있으면 그것 사용
        };

        localStorage.setItem('selected_article', JSON.stringify(finalArticleData));
        window.location.href = '../../../archive/templates/archive/article-detail.html';
    }
}


// ============================================================
// 5. 초기화 (DOMContentLoaded)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 내 관심사 표시
    const myInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    const myTopics = myInfo.topics || [];
    const displayEl = document.getElementById('my-interest-display');
    if(displayEl) {
        displayEl.textContent = myTopics.length ? myTopics.map(t=>`#${t}`).join(' ') : '설정된 관심사 없음';
    }

    // 2. 탭 전환 이벤트
    const viewToggles = document.querySelectorAll('input[name="view-type"]');
    const feedSimilar = document.getElementById('feed-similar');
    const feedOpposite = document.getElementById('feed-opposite');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const viewType = toggle.value; // 'similar' or 'opposite'
            
            if (viewType === 'similar') {
                feedSimilar.style.display = 'block';
                feedOpposite.style.display = 'none';
            } else {
                feedSimilar.style.display = 'none';
                feedOpposite.style.display = 'block';
            }
            
            // 🚨 탭 바뀔 때마다 서버에서 데이터 새로 가져옴
            fetchAndRenderFeed(viewType);
        });
    });

    // 3. 기사 클릭 이벤트 등록
    if (feedSimilar) feedSimilar.addEventListener('click', handleRecommendArticleClick);
    if (feedOpposite) feedOpposite.addEventListener('click', handleRecommendArticleClick);

    // 4. 초기 실행 (기본: similar 탭)
    fetchAndRenderFeed('similar');
});