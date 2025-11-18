document.addEventListener('DOMContentLoaded', () => {
    // 1. 아이콘과 비밀번호 입력창을 선택합니다.
    const togglePassword = document.querySelector('.input-icon');
    const passwordInput = document.getElementById('user-password');

    // 2. 아이콘에 'click' 이벤트 리스너를 추가합니다.
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            // 3. 현재 입력창의 type을 확인합니다.
            const currentType = passwordInput.getAttribute('type');

            // 4. type이 'password'면 'text'로, 'text'면 'password'로 바꿉니다.
            const newType = (currentType === 'password') ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);
        });
    }

    // ----- 2. 로그인 폼 제출(Login 버튼 클릭) 기능 -----
    const loginForm = document.getElementById('login-form');
    const userIdInput = document.getElementById('user-id');

    // (null 체크 추가)
    if (loginForm && userIdInput && passwordInput) {
        loginForm.addEventListener('submit', (event) => {
            // (중요) 폼이 실제로 제출(새로고침)되는 것을 막습니다.
            event.preventDefault(); 

            // 2-1. ID와 비밀번호 값 가져오기
            const id = userIdInput.value.trim();
            const password = passwordInput.value.trim();

            if (id === '' || password === '') {
                alert('ID와 비밀번호를 모두 입력해주세요.');
                return;
            }

            // 2-2. [데이터베이스] localStorage에서 회원가입 정보 불러오기
            const savedInfo = JSON.parse(localStorage.getItem('user-info'));

            // 2-3. (핵심!) ID와 비밀번호 일치 여부 확인
            if (savedInfo && savedInfo.userId === id && savedInfo.password === password) {
                
                // --------------------------------------------------
                // [수정!] (로그인 성공) 'current-session' (로그인 상태)을 생성합니다.
                // --------------------------------------------------
                const sessionData = {
                    nickname: savedInfo.nickname,
                    userId: savedInfo.userId,
                    name: savedInfo.name,
                    age: savedInfo.age,
                    gender: savedInfo.gender,
                    stance: savedInfo.stance,
                    topics: savedInfo.topics,
                    media: savedInfo.media
                    // (중요) 비밀번호는 세션에 저장하지 않습니다.
                };
                localStorage.setItem('current-session', JSON.stringify(sessionData));


                // 2-4. (로그인 성공) 'feed.html'로 페이지 이동
                alert(`'${savedInfo.nickname}'님, 환영합니다!`); 
                window.location.href = '/overnew_prj/feed/templates/feed/feeds.html';

            } else {
                // 2-5. (로그인 실패)
                alert('ID 또는 비밀번호가 일치하지 않습니다.');
            }
        });
    }
});