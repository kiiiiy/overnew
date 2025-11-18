// 1. 페이지가 로드되면 실행
document.addEventListener('DOMContentLoaded', () => {
    // localStorage에서 'user-info' 객체를 불러옵니다.
    const userInfo = JSON.parse(localStorage.getItem('user-info'));

    const greetingElement = document.getElementById('user-greeting');

    if (userInfo && userInfo.name) {
        // 이름이 있으면 "OOO님"으로 텍스트 변경
        greetingElement.textContent = `${userInfo.name}님`;
    } else {
        // 저장된 이름이 없으면 (예: 이 페이지로 바로 접속 시)
        greetingElement.textContent = "방문자님"; 
    }
});

// 2. 'NEXT' 버튼 클릭 시 실행
document.getElementById('next-btn-step2').addEventListener('click', () => {
    // 선택된 정치 성향 값을 찾습니다.
    const selectedStance = document.querySelector('input[name="stance"]:checked').value;

    // (중요) 기존 정보에 새 정보를 '추가'합니다.
    const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    const newInfo = { 
        ...oldInfo, // 기존의 name, age, gender 유지
        stance: selectedStance // 새 정보 추가
    };

    // localStorage에 'user-info'를 새 정보로 덮어씁니다.
    localStorage.setItem('user-info', JSON.stringify(newInfo));

    // 'info-step3.html'로 이동합니다.
    window.location.href = 'info-step3.html';
});