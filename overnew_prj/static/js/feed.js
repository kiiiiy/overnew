 // ====================
    // Dummy Data
    // ====================
    const dummyData = {
        hot: {
            politics: [
                { category: 'IT/과학', source: '빅데이터뉴스', title: "삼성SDS, IT서비스 상장기업 브랜드 평판 11월 빅데이터 분석 1위", views: '42.9k', time: '5 hours ago', image: 'https://via.placeholder.com/100x60' },
                { category: '경제', source: 'SBS', title: 'APEC 효과?...한은 "경제 심리 4년 3개월만에 최고"', views: '32.6k', time: '4 hours ago', image: 'https://via.placeholder.com/100x60' }
            ],
            economy: [
                { category: '경제', source: 'SBS', title: '경제 심리 최고', views: '31.5k', time: '3 hours ago', image: 'https://via.placeholder.com/100x60' }
            ]
        },
        following: {
            politics: [
                { followerName: '홍길동', articleSource: '서울신문', title: "'12·3' 월담 언급한 정청래…", views: '31.9k', time: '10 hours ago', image: 'https://via.placeholder.com/100x60', category: '정치' },
                { followerName: '김병비', articleSource: '서울신문', title: "비호감 정치의 위험성", views: '37.4k', time: '2 hours ago', image: 'https://via.placeholder.com/100x60', category: '정치' }
            ],
            economy: [
                { followerName: '홍길동', articleSource: '한국경제', title: "경제 기사입니다.", views: '10k', time: '1 hours ago', image: 'https://via.placeholder.com/100x60', category: '경제' }
            ]
        }
    };

    // ====================
    // 카드 생성
    // ====================
    function createHotCardHTML(cardData) {
    // 이미지 경로를 다른 PNG 파일과 동일하게 설정합니다.
    const viewIconPath = '../../../static/image/view.png'; 
    
    return `
        <a class="article-card">
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

    function createFollowingCardHTML(cardData) {
    // 이미지 경로를 다른 PNG 파일과 동일하게 설정합니다.
    const viewIconPath = '../../../static/image/view.png'; 

    return `
        <div class="following-card-group">
            <div class="follower-header">
                <img src="https://via.placeholder.com/20" class="card-avatar-small">
                <strong>${cardData.followerName}</strong>님이 열람한 기사
            </div>
            <a class="article-card">
                <div class="card-text">
                    <span class="card-category">${cardData.category}</span>
                    <span class="card-source">${cardData.articleSource}</span>
                    <h3 class="card-title">${cardData.title}</h3>
                    <div class="card-stats">
                        <span><img src="${viewIconPath}" alt="조회수" class="stat-icon"> ${cardData.views}</span> <span>${cardData.time}</span>
                    </div>
                </div>
                <img src="${cardData.image}" class="card-thumbnail">
            </a>
        </div>
    `;
}

    // ====================
    // 피드 렌더링
    // ====================
    function renderFeedPage(view, topic) {
        const feedHot = document.getElementById('feed-hot');
        const feedFollowing = document.getElementById('feed-following');
        const container = view === 'hot' ? feedHot : feedFollowing;

        container.innerHTML = '';

        let articles = [];
        if (view === 'hot') {
            Object.values(dummyData.hot).forEach(arr => { articles = articles.concat(arr); });
            articles = articles.slice(0, 10); // 최대 10개
        } else {
            articles = dummyData.following[topic] || [];
        }

        if (articles.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">이 주제의 기사 없음</p>';
            return;
        }

        let html = '';
        if (view === 'hot') articles.forEach(a => html += createHotCardHTML(a));
        else articles.forEach(a => html += createFollowingCardHTML(a));

        container.innerHTML = html;
    }

    // ====================
    // DOMContentLoaded
    // ====================
    document.addEventListener('DOMContentLoaded', () => {
    const keywordList = document.getElementById('keyword-list-container');
    const viewHot = document.getElementById('view-hot');
    const viewFollowing = document.getElementById('view-following'); // 요소 가져오기
    const bottomNav = document.querySelector('.bottom-nav');         // 하단바 가져오기

    let currentView = viewHot.checked ? 'hot' : 'following';
    let currentTopic = currentView === 'hot' ? null : 'politics';

    // 🚨 [수정] 실제 로그인 상태 확인 로직으로 교체
    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    const isLoggedIn = !!(userInfo && userInfo.nickname);

    // 🚨 [추가] 로그인 필요 알림 함수 (코드 중복 방지)
    function requireLogin(e) {
        e.preventDefault(); // 클릭 막기
        e.stopPropagation(); // 이벤트 전파 중단
        
        // 뷰가 Following으로 넘어가는 것 시각적 방지
        if(viewHot) viewHot.checked = true; 

        // SweetAlert2 혹은 기본 Alert 사용
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'OVERNEW',
                text: '로그인이 필요한 기능이에요.',
                icon: 'warning',
                confirmButtonText: '로그인 하러가기',
                confirmButtonColor: '#6c5ce7'
            }).then((result) => {
                if (result.isConfirmed) window.location.href = '../../../account/templates/account/login.html'; // 경로 확인
            });
        } else {
            alert('로그인이 필요합니다.');
            window.location.href = '../../../account/templates/account/login.html'; // 경로 확인
        }
    }

    // 🚨 [추가] 비로그인 시 차단 로직 (하단바 & 팔로잉 탭)
    if (!isLoggedIn) {
        // 1. 팔로잉 탭 클릭 시 차단
        if (viewFollowing) {
            viewFollowing.addEventListener('click', requireLogin);
        }
        // 2. 하단바 클릭 시 차단 (캡처링 모드 true로 강력하게 막음)
        if (bottomNav) {
            bottomNav.addEventListener('click', requireLogin, true);
        }
    } 
        // 초기 표시
        document.getElementById('feed-hot').style.display = currentView === 'hot' ? 'flex' : 'none';
        document.getElementById('feed-following').style.display = currentView === 'following' ? 'flex' : 'none';
        keywordList.style.display = currentView === 'following' ? 'flex' : 'none';
        renderFeedPage(currentView, currentTopic);

        // 라디오 버튼
        document.getElementById('view-hot').addEventListener('change', () => {
            currentView = 'hot';
            currentTopic = null;
            document.getElementById('feed-hot').style.display = 'flex';
            document.getElementById('feed-following').style.display = 'none';
            keywordList.style.display = 'none';
            renderFeedPage(currentView, currentTopic);
        });

        document.getElementById('view-following').addEventListener('change', () => {
            currentView = 'following';
            currentTopic = 'politics';
            document.getElementById('feed-hot').style.display = 'none';
            document.getElementById('feed-following').style.display = 'flex';
            keywordList.style.display = 'flex';
            renderFeedPage(currentView, currentTopic);
        });

        // 키워드 클릭
        document.querySelectorAll('.keyword-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                currentTopic = tag.dataset.topic;
                document.querySelectorAll('.keyword-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                renderFeedPage(currentView, currentTopic);
            });
        });

        // 버튼 예시
        
        document.getElementById('settings-menu-btn').addEventListener('click', () => {
        if (isLoggedIn) {
            // 로그인 상태: 로그인된 설정 페이지로 이동
            window.location.href = accountPath + 'settings-logged-in.html';
        } else {
            // 비로그인 상태: 로그아웃된 설정 페이지로 이동
            window.location.href = accountPath + 'settings-logged-out.html';
        }
    });
        document.getElementById('notifications-btn').addEventListener('click', (e) => {
        // 🚨 [수정] 알림 버튼도 비로그인 시 차단 함수 연결
        // if (!isLoggedIn) {
        //     requireLogin(e);
        // } else {
        //     window.location.href = '../account/templates/account/notifications.html';
        // }
    });
    }


);