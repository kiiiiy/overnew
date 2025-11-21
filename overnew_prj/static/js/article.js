// article.js 파일 전체 내용

// ----- 1. 더미 데이터 (기사 목록) -----
const dummyArticles = [
    {
        id: 'dog-meeting',
        category: '생활/문화',
        source: '노트펫',
        title: "강아지 놀이터에서 헤어진 강아지가 다시 만날 확률은... '첫눈에 알아봤댕!'",
        dateCreated: '2025.10.20 18:48:02',
        dateUpdated: '2025.11.09 09:48:15',
        author: '김기자: papercut@inbnat.co.kr',
        body: [
            "[노트펫] 중증보호소에서 헤어진 강아지 남매가 다시 만날 확률은 얼마나 될까?",
            "보호소에서 다른 무리들에게 각각 입양된 강아지 남매가...서로를 알아봤다고 미국 시사주간지 뉴스위크가 전했다.",
            "동희니 송이 지난 2020년 틱톡에 올린 동영상이...화제가 됐다. 이 영상은 28만건 넘는 '좋아요'를 받았다."
        ],
        mainImage: 'dog-meeting-image.jpg',
        embeddedImage: 'dog-tiktok-image.jpg'
    },
    {
        id: 'apec-market',
        category: '경제',
        source: 'SBS',
        title: 'APEC 효과?... 경제 뉴스 샘플',
        dateCreated: '2025.11.01 10:20:00',
        dateUpdated: '2025.11.10 09:00:00',
        author: '경제 기자',
        body: [
            "APEC 관련 경제 뉴스 샘플 내용입니다.",
            "주식 시장과 환율에 영향이 있다고 합니다."
        ],
        mainImage: 'apec-market.jpg',
        embeddedImage: 'apec-market-embed.jpg'
    }
];

// LocalStorage에서 배열 상태를 로드/저장하는 범용 함수
const loadState = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveState = (key, state) => localStorage.setItem(key, JSON.stringify(state));

// 모든 더미 기사를 ID를 키로 하는 객체로 변환 (ID로 빠르게 찾기 위함)
const ALL_ARTICLES = dummyArticles.reduce((acc, article) => {
    acc[article.id] = article;
    return acc;
}, {});


// ----- 2. 콘텐츠 로드 및 표시 함수 -----
function loadAndRenderArticle(articleData) {
    if (!articleData) {
        document.querySelector('.article-title').textContent = "기사를 찾을 수 없습니다.";
        return;
    }

    // HTML 요소 채우기
    const titleEl = document.querySelector('.article-title');
    const metaEl = document.querySelector('.article-meta');
    const bodyEl = document.querySelector('.article-body');
    const mainImgEl = document.querySelector('.article-figure img');
    const captionEl = document.querySelector('.article-caption');
    const embeddedEl = document.querySelector('.article-embedded-content img');

    if (titleEl) titleEl.textContent = articleData.title;
    if (metaEl) metaEl.innerHTML = `
        <span>작성일: ${articleData.dateCreated}</span>
        <span>수정일: ${articleData.dateUpdated}</span>
        <span>${articleData.author}</span>
    `;
    if (bodyEl) bodyEl.innerHTML = articleData.body.map(p => `<p>${p}</p>`).join('');
    
    if (mainImgEl) mainImgEl.src = articleData.mainImage;
    if (captionEl) captionEl.textContent = articleData.title;
    if (embeddedEl) embeddedEl.src = articleData.embeddedImage;
}


// ----- 3. 액션 버튼 기능 함수 (상태 유지 및 토글) -----
function initActionButtons(articleId) {
    const likeBtn = document.getElementById('like-btn');
    const discussBtn = document.getElementById('discuss-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');

    if (!likeBtn || !bookmarkBtn || !discussBtn) return;

    // LocalStorage 상태 키 정의
    const LIKE_KEY = 'liked_articles';
    const BOOKMARK_KEY = 'bookmarked_articles';
    const DISCUSS_KEY = 'discussion_votes';

    // 1. 초기 상태 로드
    let likedArticles = loadState(LIKE_KEY);
    let bookmarkedArticles = loadState(BOOKMARK_KEY);
    let discussionVotes = loadState(DISCUSS_KEY);

    // 2. 버튼 상태 설정 (로컬 스토리지 상태를 읽어와 버튼에 active 클래스를 적용합니다.)
    const setButtonState = (button, stateArray) => {
        if (stateArray.includes(articleId)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    };

    setButtonState(likeBtn, likedArticles);
    setButtonState(bookmarkBtn, bookmarkedArticles);
    setButtonState(discussBtn, discussionVotes);

    // 3. 상태 토글 및 LocalStorage 업데이트 범용 로직
    const toggleState = (button, stateKey, currentArray) => {
        button.classList.toggle('active');
        const isActive = button.classList.contains('active');
        let newArray = currentArray;

        if (isActive) {
            // 추가
            if (!newArray.includes(articleId)) {
                newArray.push(articleId);
            }
        } else {
            // 삭제
            newArray = newArray.filter(id => id !== articleId);
        }
        saveState(stateKey, newArray);
        return newArray;
    };

    // 좋아요 버튼 클릭 이벤트
    likeBtn.addEventListener('click', () => {
        likedArticles = loadState(LIKE_KEY);
        likedArticles = toggleState(likeBtn, LIKE_KEY, likedArticles);
    });

    // 북마크 버튼 클릭 이벤트
    bookmarkBtn.addEventListener('click', () => {
        bookmarkedArticles = loadState(BOOKMARK_KEY); 
        bookmarkedArticles = toggleState(bookmarkBtn, BOOKMARK_KEY, bookmarkedArticles);
    });

    // 토론 버튼 클릭 이벤트
    discussBtn.addEventListener('click', () => {
        discussionVotes = loadState(DISCUSS_KEY);
        discussionVotes = toggleState(discussBtn, DISCUSS_KEY, discussionVotes);
    });
}


// ----- 4. 메인 초기화 라우터 (핵심 수정 부분) -----
document.addEventListener('DOMContentLoaded', () => {
    
    // ⭐⭐⭐ 핵심 수정: LocalStorage 대신 URL 파라미터에서 ID를 읽어옵니다. ⭐⭐⭐
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id'); // URL에서 'id' 파라미터 값을 가져옴
    
    // ID가 없으면 기본 기사를 로드하고, 있으면 해당 ID의 기사를 로드
    const articleToLoadId = articleId || 'dog-meeting'; 
    const articleData = ALL_ARTICLES[articleToLoadId];

    // 3. 기사 내용 렌더링
    loadAndRenderArticle(articleData);
    
    // 4. 액션 버튼 초기화 실행
    if (articleData) {
        initActionButtons(articleToLoadId);
    }
    
    // 5. 뒤로 가기 버튼 기능 연결
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.history.back(); 
        });
    }
    
    // ⚠️ 참고: 이제 LocalStorage 키 'selected_article'은 사용되지 않습니다.
});