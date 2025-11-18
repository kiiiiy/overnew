document.addEventListener('DOMContentLoaded', () => {

    // 뒤로가기 버튼 기능
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); // <a> 태그의 기본 동작 방지
            window.history.back(); // 브라우저의 이전 페이지로 이동
        });
    }
});