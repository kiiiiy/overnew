// 'NEXT' 버튼 클릭 시
document.getElementById('next-btn-step5').addEventListener('click', () => {
    
    // 1. 입력 값 가져오기
    const nickname = document.getElementById('nickname').value;
    const userId = document.getElementById('user-id').value;
    const password = document.getElementById('user-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 2. 유효성 검사
    if (!nickname || !userId || !password || !confirmPassword) {
        alert('모든 항목을 입력해주세요.');
        return;
    }

    // (핵심) 비밀번호 일치 확인
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        return;
    }

    // 3. 기존 정보에 새 계정 정보 '추가'
    const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
    const finalUserInfo = { 
        ...oldInfo, // name, age, gender, stance, topics, media 유지
        nickname: nickname,
        userId: userId,
        password: password
    };

    // localStorage에 'finalUserInfo'로 덮어씁니다.
    localStorage.setItem('user-info', JSON.stringify(finalUserInfo));

    // 'signup-complete.html'로 이동합니다.
    window.location.href = 'signup-complete.html'; 
});