/* ==========================================================================
   1. 공통 함수 (formatTimeAgo, initializeNotifications)
   ========================================================================== */

function formatTimeAgo(timestamp) {
    const past = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now - past) / 1000);
    const MINUTE = 60, HOUR = MINUTE * 60, DAY = HOUR * 24, MONTH = DAY * 30;

    if (diffSeconds < MINUTE) return "방금 전";
    if (diffSeconds < HOUR) return `${Math.floor(diffSeconds / MINUTE)}분 전`;
    if (diffSeconds < DAY) return `${Math.floor(diffSeconds / HOUR)}시간 전`;
    if (diffSeconds < MONTH) return `${Math.floor(diffSeconds / DAY)}일 전`;

    const year = String(past.getFullYear()).slice(-2);
    const month = String(past.getMonth() + 1).padStart(2, '0');
    const day = String(past.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function initializeNotifications() {
    let readStates = JSON.parse(localStorage.getItem('read_notifications')) || {};
    document.querySelectorAll('.notification-item').forEach(item => {
        const notifId = item.dataset.notifId;
        const notifTime = item.dataset.time;
        const timestampElement = item.querySelector('.notif-timestamp');

        if (notifTime && timestampElement) {
            timestampElement.textContent = formatTimeAgo(notifTime);
        }
        if (notifId && readStates[notifId]) {
            item.classList.add('read');
        }
        item.addEventListener('click', () => {
            if (!notifId) return;
            item.classList.add('read');
            readStates[notifId] = true;
            localStorage.setItem('read_notifications', JSON.stringify(readStates));
        });
    });
}


/* ==========================================================================
   2. 페이지별 초기화 함수들 (main.js의 역할)
   ========================================================================== */

// [Splash] index.html
function initSplashPage() {
    // 🚨 [수정됨] 2초 후에 'feed' 페이지로 이동. 피드 화면이 루트 경로 '/'라고 가정합니다.
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
}

// [Email Verify] email_verify.html - 👈 새로 추가된 기능
function initEmailVerifyPage() {
    const sendCodeBtn = document.getElementById('send-code-btn');
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    const emailInput = document.getElementById('signup-email');
    const codeInput = document.getElementById('signup-code');

    // --- 1. 인증번호 전송 버튼 이벤트 (send-code-btn) ---
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', async () => {
            const email = emailInput.value.trim();

            if (!email) {
                alert('이메일 주소를 입력해주세요.');
                return;
            }

            try {
                const response = await fetch('/account/api/send-email-code/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (data.ok) {
                    alert('✅ 메일을 보냈습니다. (10분 이내 입력)');
                } else {
                    alert('전송 실패: ' + (data.error || '알 수 없는 서버 오류'));
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
                alert('네트워크 연결 오류 또는 서버 문제.');
            }
        });
    }

    // --- 2. 인증번호 확인 버튼 이벤트 (verify-code-btn) ---
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            const code = codeInput.value.trim();

            if (!email || !code) {
                alert('이메일과 인증번호를 모두 입력해주세요.');
                return;
            }

            try {
                const response = await fetch('/account/api/verify-email-code/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, code: code })
                });

                const data = await response.json();

                if (data.ok) {
                    alert('🎉 이메일 인증이 완료되었습니다! 다음 단계로 이동합니다.');
                    // 인증 성공 시 다음 단계 (step1)로 이동
                    window.location.href = '/account/signup/step1/';
                } else {
                    alert('인증 실패: ' + (data.error || '인증번호가 일치하지 않습니다.'));
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
                alert('네트워크 연결 오류 또는 서버 문제.');
            }
        });
    }
}


// [Step 1] info-step1.html
function initInfoStep1Page() {
    document.getElementById('next-btn-step1').addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const age = document.getElementById('user-age').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        if (!name || !age || !gender) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        const userInfo = { name, age, gender };
        localStorage.setItem('user-info', JSON.stringify(userInfo));
        window.location.href = '/account/signup/step2/';
    });
}

// [Step 2] info-step2.html
function initInfoStep2Page() {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const greetingElement = document.getElementById('user-greeting');
    if (userInfo && userInfo.name) {
        greetingElement.textContent = `${userInfo.name}님`;
    } else {
        greetingElement.textContent = "방문자님";
    }

    document.getElementById('next-btn-step2').addEventListener('click', () => {
        const selectedStance = document.querySelector('input[name="stance"]:checked').value;
        const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
        const newInfo = { ...oldInfo, stance: selectedStance };
        localStorage.setItem('user-info', JSON.stringify(newInfo));
        window.location.href = '/account/signup/step3/';
    });
}

// [Step 3] info-step3.html
function initInfoStep3Page() {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const greetingElement = document.getElementById('user-greeting');
    if (userInfo && userInfo.name) {
        greetingElement.textContent = `${userInfo.name}님`;
    } else {
        greetingElement.textContent = "방문자님";
    }

    document.getElementById('next-btn-step3').addEventListener('click', () => {
        const checkedTopics = document.querySelectorAll('input[name="topic"]:checked');
        if (checkedTopics.length === 0) {
            alert('관심 분야를 한 개 이상 선택해주세요.');
            return;
        }
        const selectedTopics = Array.from(checkedTopics).map(checkbox => checkbox.value);
        const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
        const newInfo = { ...oldInfo, topics: selectedTopics };
        localStorage.setItem('user-info', JSON.stringify(newInfo));
        window.location.href = '/account/signup/step4/';
    });
}

// [Step 4] info-step4.html
function initInfoStep4Page() {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const greetingElement = document.getElementById('user-greeting');
    if (userInfo && userInfo.name) {
        greetingElement.textContent = `${userInfo.name}님`;
    } else {
        greetingElement.textContent = "방문자님";
    }

    document.getElementById('next-btn-step4').addEventListener('click', () => {
        const checkedMedia = document.querySelectorAll('input[name="media"]:checked');
        if (checkedMedia.length === 0) {
            alert('관심 언론사를 한 개 이상 선택해주세요.');
            return;
        }
        const selectedMedia = Array.from(checkedMedia).map(checkbox => checkbox.value);
        const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
        const newInfo = { ...oldInfo, media: selectedMedia };
        localStorage.setItem('user-info', JSON.stringify(newInfo));
        window.location.href = '/account/signup/step5/';
    });
}

// [Step 5] info-step5.html
function initInfoStep5Page() {
    document.getElementById('next-btn-step5').addEventListener('click', () => {
        const nickname = document.getElementById('nickname').value;
        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!nickname || !userId || !password || !confirmPassword) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }
        const oldInfo = JSON.parse(localStorage.getItem('user-info')) || {};
        const finalUserInfo = {
            ...oldInfo,
            nickname: nickname,
            userId: userId,
            password: password
        };
        localStorage.setItem('user-info', JSON.stringify(finalUserInfo));
        window.location.href = '/account/signup/complete/';
    });
}

// [Signup Complete] signup-complete.html
function initSignupCompletePage() {
    setTimeout(() => {
        // 🚨 [수정됨] 완료 후 루트 경로 '/' (피드 화면)로 이동
        window.location.href = '/';
    }, 3000);
}

function initLoginPage() {
    const togglePassword = document.querySelector('.input-icon');
    const passwordInput = document.getElementById('user-password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const currentType = passwordInput.getAttribute('type');
            const newType = (currentType === 'password') ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);
        });
    }

    const loginForm = document.getElementById('login-form');
    const userIdInput = document.getElementById('user-id');

    // 💡 [수정됨] 폼 제출 이벤트 리스너:
    // 로컬 스토리지 기반의 임시 로그인 로직을 삭제하고, 
    // 빈 값 체크만 남겨 Django 백엔드(views.py의 login_view)로 폼이 정상적으로 제출되도록 허용합니다.
    if (loginForm && userIdInput && passwordInput) {
        loginForm.addEventListener('submit', (event) => {
            const id = userIdInput.value.trim();
            const password = passwordInput.value.trim();

            if (id === '' || password === '') {
                event.preventDefault(); // 빈 값이면 제출을 막고 알림 표시
                alert('ID와 비밀번호를 모두 입력해주세요.');
            }
            // 유효성 검사를 통과하면 event.preventDefault()를 호출하지 않아 
            // HTML 폼이 Django views.py로 POST 요청을 보냅니다.
        });
    }
}

// [Settings - Logged In] settings-logged-in.html
function initSettingsLoggedInPage() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 🚨 [수정됨] 피드 화면(루트 경로 '/')으로 이동
            window.location.href = '/';
        });
    }

    // 🚨 'current-session' 사용
    const userInfo = JSON.parse(localStorage.getItem('current-session'));


    const nicknameEl = document.getElementById('user-nickname');
    const tagsEl = document.getElementById('user-tags');
    if (nicknameEl && userInfo.nickname) {
        nicknameEl.textContent = userInfo.nickname;
    }
    if (tagsEl && userInfo.topics && userInfo.topics.length > 0) {
        tagsEl.textContent = userInfo.topics.map(topic => `#${topic}`).join(' ');
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('정말 로그아웃 하시겠습니까?')) {
                localStorage.removeItem('current-session');
                alert('로그아웃되었습니다.');

                // ✅ 이 부분을 수정합니다: Django settings 뷰 경로(절대 경로)로 이동
                window.location.href = '/account/settings/';
            }
        });
    }

    const profileEditBtn = document.getElementById('profile-edit-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/account/profile/edit/';
        });
    }
    const notificationsBtn = document.getElementById('notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/account/notifications/';
        });
    }
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('정말로 계정을 탈퇴하시겠습니까?\n모든 정보가 삭제되며 이 작업은 되돌릴 수 없습니다.')) {
                localStorage.removeItem('user-info');
                localStorage.removeItem('current-session');
                alert('계정이 성공적으로 삭제되었습니다.');
                window.location.href = '/account/login/';
            }
        });
    }
}

// [Settings - Logged Out] settings-logged-out.html
function initSettingsLoggedOutPage() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
}


/* ==========================================================================
   3. 메인 라우터 (페이지 ID 확인 후 실행)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const bodyId = document.body.id;

    if (bodyId === 'page-splash') {
        initSplashPage();
    } else if (bodyId === 'page-email-verify') { // 👈 이메일 인증 페이지 초기화 함수 호출 추가
        initEmailVerifyPage();
    } else if (bodyId === 'page-info-step1') {
        initInfoStep1Page();
    } else if (bodyId === 'page-info-step2') {
        initInfoStep2Page();
    } else if (bodyId === 'page-info-step3') {
        initInfoStep3Page();
    } else if (bodyId === 'page-info-step4') {
        initInfoStep4Page();
    } else if (bodyId === 'page-info-step5') {
        initInfoStep5Page();
    } else if (bodyId === 'page-login') {
        initLoginPage();
    } else if (bodyId === 'page-notifications') {
        // initNotificationPage() 함수는 위 코드에 없으므로 주석 처리 또는 추가 필요
        // initNotificationPage(); 
    } else if (bodyId === 'page-settings-logged-in') {
        initSettingsLoggedInPage();
    } else if (bodyId === 'page-settings-logged-out') {
        initSettingsLoggedOutPage();
    } else if (bodyId === 'page-signup-complete') {
        initSignupCompletePage();
    }
});