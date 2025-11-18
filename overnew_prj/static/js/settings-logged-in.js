document.addEventListener('DOMContentLoaded', () => {

    // 뒤로가기 버튼 기능
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); // <a> 태그의 기본 동작 방지
            window.history.back(); // 브라우저의 이전 페이지로 이동
        });
    }

    // 1. localStorage에서 저장된 정보 불러오기
    const userInfo = JSON.parse(localStorage.getItem('user-info'));

    // 2. (방어 코드) 만약 저장된 정보가 없으면 (로그인 안 한 상태)
    // . '로그인 전' 설정 페이지로 쫓아냅니다.
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        // (중요) 로그인 안 한 버전을 settings-logged-out.html로 가정
        window.location.href = 'settings-logged-out.html'; 
        return; // 코드 실행 중단
    }

    // 3. (핵심) 정보가 있으면, HTML 요소에 값을 채워넣기
    const nicknameEl = document.getElementById('user-nickname');
    const tagsEl = document.getElementById('user-tags');

    // '나소공' (닉네임)
    if (nicknameEl && userInfo.nickname) {
        nicknameEl.textContent = userInfo.nickname;
    }
    // '#it #경제' (관심 분야 토픽)
    if (tagsEl && userInfo.topics && userInfo.topics.length > 0) {
        const tags = userInfo.topics
            .map(topic => `#${topic}`) // ["it", "economy"] -> ["#it", "#economy"]
            .join(' '); // "#it #economy"
        tagsEl.textContent = tags;
    }

    // 4. (핵심) 로그아웃 버튼 기능 (DOMContentLoaded 안으로 이동)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // <a> 태그의 기본 이동 기능 막기

            if (confirm('정말 로그아웃 하시겠습니까?')) {
                // 저장된 사용자 정보 삭제
                localStorage.removeItem('user-info');
                
                // 로그아웃 완료 알림 및 페이지 이동
                alert('로그아웃되었습니다.');
                window.location.href = 'login.html'; // 로그인 페이지로 이동
            }
        });
    }
});