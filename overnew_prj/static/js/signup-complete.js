// 3초(3000ms) 후에 코드를 실행합니다.
setTimeout(() => {
    
    // (선택 사항) 회원가입 정보가 서버로 전송 완료되었다면,
    // 브라우저의 localStorage에서는 지우는 것이 보안상 좋습니다.
    // localStorage.removeItem('user-info');

    // 'main.html'로 이동합니다.
    window.location.href = 'main.html'; 

}, 3000); // 3초 딜레이