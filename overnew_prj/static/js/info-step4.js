// 1. 페이지가 로드되면 이름 표시 (step3와 동일)
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const greetingElement = document.getElementById('user-greeting');
    if (userInfo && userInfo.name) {
        greetingElement.textContent = `${userInfo.name}님`;
    } else {
        greetingElement.textContent = "방문자님"; 
    }
});

// 2. 'NEXT' 버튼 클릭 시 (복수 선택 처리)
document.getElementById('next-btn-step4').addEventListener('click', () => {
    
    // (핵심) '모든' 체크된 박스를 가져옵니다. (name="media")
    const checkedMedia = document.querySelectorAll('input[name="media"]:checked');
    
    // 유효성 검사 (1개 이상 선택)
    if (checkedMedia.length === 0) {
        alert('관심 언론사를 한 개 이상 선택해주세요.');
        return;
    }

    // (핵심) NodeList를 '값의 배열'로 변환합니다.
    const selectedMedia = Array.from(checkedMedia).map(checkbox => checkbox.value);

    // 기존 정보에 새 정보를 '추가'합니다.
    const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    const newInfo = { 
        ...oldInfo, // name, age, gender, stance, topics 유지
        media: selectedMedia // '배열' 자체를 저장
    };

    // localStorage에 새 정보로 덮어씁니다.
    localStorage.setItem('user-info', JSON.stringify(newInfo));

    // 'info-step5.html'로 이동합니다.
    window.location.href = 'info-step5.html'; 
});