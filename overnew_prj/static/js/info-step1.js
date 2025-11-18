document.getElementById('next-btn-step1').addEventListener('click', () => {
    // 1. 입력 값 가져오기
    const name = document.getElementById('user-name').value;
    const age = document.getElementById('user-age').value;
    // :checked 된 요소가 없으면 null 에러 방지
    const gender = document.querySelector('input[name="gender"]:checked')?.value; 

    // 2. 유효성 검사 (간단히)
    if (!name || !age || !gender) {
        alert('모든 정보를 입력해주세요.');
        return; // 함수 종료
    }
    
    // 3. localStorage에 '객체' 형태로 저장
    const userInfo = {
        name: name,
        age: age,
        gender: gender
    };
    localStorage.setItem('user-info', JSON.stringify(userInfo));

    // 4. (중요!) 'info-step2.html'로 페이지 이동
    window.location.href = 'info-step2.html';
});