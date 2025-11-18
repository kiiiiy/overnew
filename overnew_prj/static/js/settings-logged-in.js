document.addEventListener('DOMContentLoaded', () => {

    // 뒤로가기 버튼 기능
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.history.back(); 
        });
    }

    // 1. 'current-session' (로그인 상태)을 불러옵니다.
    const userInfo = JSON.parse(localStorage.getItem('current-session'));

    // 2. (방어 코드) 'current-session'이 없으면 쫓아냅니다.
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'settings-logged-out.html'; 
        return; 
    }

    // 3. (핵심) 정보가 있으면, HTML 요소에 값을 채워넣기
    const nicknameEl = document.getElementById('user-nickname');
    const tagsEl = document.getElementById('user-tags');

    if (nicknameEl && userInfo.nickname) {
        nicknameEl.textContent = userInfo.nickname;
    }
    if (tagsEl && userInfo.topics && userInfo.topics.length > 0) {
        const tags = userInfo.topics
            .map(topic => `#${topic}`)
            .join(' ');
        tagsEl.textContent = tags;
    }

    // 4. (핵심) 로그아웃 버튼 기능
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (confirm('정말 로그아웃 하시겠습니까?')) {
                // 'current-session'(로그인 상태)만 삭제
                localStorage.removeItem('current-session');
                
                alert('로그아웃되었습니다.');
                window.location.href = 'login.html'; 
            }
        });
    }

    // 5. 프로필 수정 버튼 기능
    const profileEditBtn = document.getElementById('profile-edit-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = 'profile-edit.html'; 
        });
    }

    // 6. 알림 설정 버튼 기능
    const notificationsBtn = document.getElementById('notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'notifications.html';
        });
    }

    // --------------------------------------------------
    // [수정!] 7. 탈퇴하기 버튼 기능 (즉시 탈퇴 로직으로 변경)
    // --------------------------------------------------
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. (경고!) 강력한 경고 메시지
            if (confirm('정말로 계정을 탈퇴하시겠습니까?\n모든 정보가 삭제되며 이 작업은 되돌릴 수 없습니다.')) {
                
                // 2. [즉시 탈퇴] 'user-info'(DB)와 'current-session'(로그인 상태)을 모두 삭제합니다.
                localStorage.removeItem('user-info');
                localStorage.removeItem('current-session');
                
                // 3. 탈퇴 완료 알림 및 로그인 페이지로 이동
                alert('계정이 성공적으로 삭제되었습니다.');
                window.location.href = 'login.html'; 
            }
        });
    }
});