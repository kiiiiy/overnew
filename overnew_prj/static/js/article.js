document.addEventListener('DOMContentLoaded', () => {

    // 🚨 [정리] 불필요한 하드코딩 데이터(dummyArticles)는 제거했습니다.
    // 1. localStorage에서 데이터 꺼내기
    const articleData = JSON.parse(localStorage.getItem('selected_article'));

    if (!articleData) {
        console.error("기사 데이터가 없습니다. 피드에서 다시 접근해주세요.");
        // 비상시 처리: window.history.back();
        return;
    }

    // 2. HTML 요소 가져오기
    const titleEl = document.querySelector('.article-title') || document.getElementById('article-title');
    const categoryEl = document.querySelector('.article-category') || document.getElementById('article-category');
    const metaEl = document.querySelector('.article-meta') || document.getElementById('article-meta'); 
    const bodyEl = document.querySelector('.article-body') || document.getElementById('article-content');
    const imageEl = document.querySelector('.article-image') || document.getElementById('article-image'); 
    const captionEl = document.querySelector('.article-caption');
    const embeddedEl = document.querySelector('.article-embedded-content img');

    // 3. 데이터 화면에 뿌리기
    
    // (1) 카테고리 (Category는 articleData에 category로 넘어왔습니다.)
    if (categoryEl) categoryEl.textContent = articleData.category || '뉴스';
    
    // (2) 제목
    if (titleEl) titleEl.textContent = articleData.title;
    
    // (3) 메타 정보 (기자 / 날짜) - feed.js에서 심어준 author/date를 사용합니다.
    if (metaEl) {
        const author = articleData.author || articleData.source || '기자 정보 없음';
        const date = articleData.date || articleData.time || '날짜 정보 없음';
        metaEl.innerHTML = `
            <span>${author}</span>
            <span>${date}</span>
        `;
    }

    // (4) 본문 내용 (배열을 문단으로 변환)
    if (bodyEl && Array.isArray(articleData.body)) {
        bodyEl.innerHTML = articleData.body.map(text => `<p>${text}</p>`).join('');
    }

    // (5) 메인 이미지 및 캡션
    if (imageEl) {
        imageEl.src = articleData.mainImage || articleData.image || '';
        imageEl.alt = articleData.title;
        if (!imageEl.src) imageEl.style.display = 'none';
    }
    if (captionEl) captionEl.textContent = articleData.title;
    if (embeddedEl) embeddedEl.src = articleData.embeddedImage || '';
    
    
    // 4. [기존 로직 합치기] 좋아요, 댓글, 북마크 버튼 토글
    ['like-btn', 'discuss-btn', 'bookmark-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // 5. [기존 로직 합치기] 뒤로가기 버튼 기능
    const backBtn = document.getElementById("back-button");
    if (backBtn) {
         backBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.history.back();
        });
    }
});