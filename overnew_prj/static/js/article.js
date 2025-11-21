document.addEventListener('DOMContentLoaded', () => {

    // 1. localStorage에서 데이터 꺼내기 (페이지 초기 로드)
    const articleData = JSON.parse(localStorage.getItem('selected_article'));

    if (!articleData) {
        console.error("기사 데이터가 없습니다. 피드에서 다시 접근해주세요.");
        return;
    }
    
    // 2. HTML 요소 가져오기
    const titleEl = document.querySelector('.article-title') || document.getElementById('article-title');
    const categoryEl = document.querySelector('.article-category') || document.getElementById('article-category');
    const metaEl = document.querySelector('.article-meta') || document.getElementById('article-meta'); 
    const bodyEl = document.querySelector('.article-body') || document.getElementById('article-content');
    const imageEl = document.querySelector('.article-image') || document.getElementById('article-image'); 
    const sourceEl = document.querySelector('.source-text');
    const bookmarkBtn = document.getElementById('bookmark-btn');
    
    // 3. 북마크 초기 상태 로드 및 클릭 이벤트 등록
    let initialBookmarks = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    const isBookmarkedInitially = initialBookmarks.some(item => item.id === articleData.id);

    if (bookmarkBtn) {
        // 초기 UI 반영
        if (isBookmarkedInitially) {
            bookmarkBtn.classList.add('active');
        }

        // 🚨 [핵심 수정] 북마크 버튼 클릭 이벤트 핸들러 (클릭 시마다 최신 상태 로드)
        bookmarkBtn.addEventListener('click', () => {
            
            // 💡 [수정] 클릭할 때마다 localStorage에서 최신 배열을 불러와서 사용
            let currentBookmarks = JSON.parse(localStorage.getItem('bookmarked_articles')) || []; 
            const existingIndex = currentBookmarks.findIndex(item => item.id === articleData.id);
            
            // UI 상태는 button.classList.contains('active')로 확인
            
            if (existingIndex !== -1) {
                // [언북마크] 데이터 배열에서 제거
                currentBookmarks.splice(existingIndex, 1);
                bookmarkBtn.classList.remove('active');
                alert('북마크가 취소되었습니다!');
            } else {
                // [북마크] 데이터 배열에 추가
                currentBookmarks.push(articleData); 
                bookmarkBtn.classList.add('active');
                alert('기사가 북마크되었습니다!');
            }
            
            // 최종 리스트 localStorage에 저장
            localStorage.setItem('bookmarked_articles', JSON.stringify(currentBookmarks));
        });
    }
    function resizeIframe() {
    if (window.frameElement) {
        window.frameElement.style.height = document.body.scrollHeight + 'px';
    }
}

window.addEventListener('load', resizeIframe);
window.addEventListener('resize', resizeIframe);



    // 4. 데이터 화면에 뿌리기
    
    if (categoryEl) categoryEl.textContent = articleData.category || '뉴스';
    if (titleEl) titleEl.textContent = articleData.title;
    
    if (metaEl) {
        const author = articleData.author || articleData.source || '기자 정보 없음';
        const date = articleData.date || articleData.time || '2025.11.21';
        metaEl.innerHTML = `
            <span>${author}</span>
            <span>${date}</span>
        `;
    }

    if (bodyEl && Array.isArray(articleData.body)) {
        bodyEl.innerHTML = articleData.body.map(text => `<p>${text}</p>`).join('');
    }

    if (imageEl) {
        const imgSrc = articleData.mainImage || articleData.image || '';
        if (imgSrc) {
            imageEl.src = imgSrc;
            imageEl.alt = articleData.title;
        } else {
            imageEl.style.display = 'none';
        }
    }
    
    // 5. [기존 로직] 좋아요/댓글 버튼 UI 토글 (저장 기능 없음)
    ['like-btn', 'discuss-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => btn.classList.toggle('active')); 
    });
    
    // 6. [기존 로직] 뒤로가기 버튼 기능
    const backBtn = document.getElementById("back-button");
    if (backBtn) {
         backBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.history.back();
        });
    }
});