// article.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. localStorage에서 데이터 꺼내기
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
    const bookmarkBtn = document.getElementById('bookmark-btn'); // 🚨 북마크 버튼 요소 가져오기
    
    // 3. 북마크 초기 상태 로드 및 클릭 이벤트 등록
    // null, undefined, id 없는 객체 자동 제거
    let bookmarkedList = JSON.parse(localStorage.getItem('bookmarked_articles')) || [];
    bookmarkedList = bookmarkedList.filter(item => item && item.id);
    const isBookmarked = bookmarkedList.some(item => item.id === articleData.id);

    if (bookmarkBtn) {
        // 초기 UI 반영: 북마크 되어 있으면 active 클래스 추가
        if (isBookmarked) {
            bookmarkBtn.classList.add('active');
        }

        // 🚨 [핵심] 북마크 버튼 클릭 이벤트 핸들러 (저장 로직)
        bookmarkBtn.addEventListener('click', () => {
            const isCurrentlyActive = bookmarkBtn.classList.contains('active');
            
            if (isCurrentlyActive) {
                // [언북마크] active 클래스 제거 & 리스트에서 해당 ID 제거
                bookmarkBtn.classList.remove('active');
                bookmarkedList = bookmarkedList.filter(item => item.id !== articleData.id);
                alert('북마크가 취소되었습니다!');
            } else {
                // [북마크] active 클래스 추가 & 리스트에 데이터 추가
                bookmarkBtn.classList.add('active');
                bookmarkedList.push(articleData); // 🚨 기사 데이터 전체 저장
                alert('기사가 북마크되었습니다!');
            }
            
            // 최종 리스트 localStorage에 저장
            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarkedList));
        });
    }


    // 4. 데이터 화면에 뿌리기
    
    // (1) 카테고리
    if (categoryEl) categoryEl.textContent = articleData.category || '뉴스';
    
    // (2) 제목
    if (titleEl) titleEl.textContent = articleData.title;

    // (3) 메타 정보 (기자 / 날짜)
    if (metaEl) {
        const author = articleData.author || articleData.source || '기자 정보 없음';
        const date = articleData.date || articleData.time || '2025.11.21';
        metaEl.innerHTML = `
            <span>${author}</span>
            <span>${date}</span>
        `;
    }

    // (4) 본문 내용
    if (bodyEl && Array.isArray(articleData.body)) {
        bodyEl.innerHTML = articleData.body.map(text => `<p>${text}</p>`).join('');
    }

    // (5) 메인 이미지 및 캡션
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
        // 북마크는 위에서 따로 처리했으므로 제외
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