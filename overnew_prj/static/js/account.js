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
    // 🚨 [수정된 로직] 2초 후에 'feed' 페이지로 이동
    setTimeout(() => {
        // 절대 경로로 수정 (로그인 페이지의 경로를 기준으로 추정)
        window.location.href = '/overnew_prj/feed/templates/feed/feed.html';
    }, 2000); 
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
        window.location.href = 'info-step2.html';
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
        window.location.href = 'info-step3.html';
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
        window.location.href = 'info-step4.html';
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
        window.location.href = 'info-step5.html'; 
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
        window.location.href = 'signup-complete.html'; 
    });
}

// [Signup Complete] signup-complete.html
function initSignupCompletePage() {
    setTimeout(() => {
        window.location.href = '/overnew_prj/feed/templates/feed/feed.html'; 
    }, 3000); 
}

// [Login] login.html
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

    if (loginForm && userIdInput && passwordInput) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const id = userIdInput.value.trim();
            const password = passwordInput.value.trim();

            if (id === '' || password === '') {
                alert('ID와 비밀번호를 모두 입력해주세요.');
                return;
            }
            const savedInfo = JSON.parse(localStorage.getItem('user-info'));
            if (savedInfo && savedInfo.userId === id && savedInfo.password === password) {
                const sessionData = { ...savedInfo };
                delete sessionData.password; 
                localStorage.setItem('current-session', JSON.stringify(sessionData));
                alert(`'${savedInfo.nickname}'님, 환영합니다!`); 
                window.location.href = '../../../feed/templates/feed/feed.html';
            } else {
                alert('ID 또는 비밀번호가 일치하지 않습니다.');
            }
        });
    }
}

// [Notifications] notifications.html
function initNotificationPage() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.history.back(); 
        });
    }
    
    // 🚨 [수정!] 'current-session' 사용
    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    if (!userInfo || !userInfo.nickname) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html'; 
        return; 
    }
    document.querySelectorAll('.username').forEach(element => {
        element.textContent = userInfo.nickname; 
    });
    initializeNotifications(); 
}

// [Settings - Logged In] settings-logged-in.html
function initSettingsLoggedInPage() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            const feedUrl = '../../../feed/templates/feed/feed.html';
            
            window.location.href = feedUrl;
        });
    }

    // 🚨 [수정!] 'current-session' 사용
    const userInfo = JSON.parse(localStorage.getItem('current-session'));
    if (!userInfo) {
        //alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'settings-logged-out.html'; 
        return; 
    }

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
                window.location.href = 'login.html'; 
            }
        });
    }
    
    const profileEditBtn = document.getElementById('profile-edit-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = 'profile-edit.html'; 
        });
    }
    const notificationsBtn = document.getElementById('notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'notifications.html';
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
                window.location.href = 'login.html'; 
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
        initNotificationPage();
    } else if (bodyId === 'page-settings-logged-in') {
        initSettingsLoggedInPage();
    } else if (bodyId === 'page-settings-logged-out') {
        initSettingsLoggedOutPage();
    } else if (bodyId === 'page-signup-complete') {
        initSignupCompletePage();
    }
    // 🚨 [여기에 추가] 방금 만든 약관 동의 페이지 연결
    else if (bodyId === 'page-terms-agreement') {
        initTermsAgreementPage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 🚨 기존의 모든 이벤트 리스너 코드 (로그아웃, 뒤로가기 등)는 여기에 포함되어 있다고 가정합니다.

    // 1. 사용자 정보를 불러와 화면에 표시하는 함수
    function displayUserInfo() {
        // 🚨 [수정 핵심] 'user-info'가 아니라 'current-session'을 확인해야 함!
        // 로그아웃 상태라면 current-session이 없으므로 null이 됩니다.
        const sessionInfo = JSON.parse(localStorage.getItem('current-session'));
        // 로컬 스토리지에서 최신 정보 로드
        const userInfo = JSON.parse(localStorage.getItem('user-info') || 'null');
        
        // 설정 페이지 HTML 요소 ID (settings-logged-in.html에 있어야 함)
        const nicknameEl = document.getElementById('user-nickname');
        const tagsEl = document.getElementById('user-tags');
        
        if (userInfo) {
            // A. 닉네임 업데이트
            if (nicknameEl) {
                // 저장된 닉네임이 있으면 표시, 없으면 기본값 표시
                nicknameEl.textContent = userInfo.nickname || 'OVERNEW 사용자';
            }
            
            // B. 관심 분야 태그 업데이트
            if (tagsEl && userInfo.topics && Array.isArray(userInfo.topics)) {
                // ['정치', '경제'] -> '#정치 #경제' 문자열로 변환하여 표시
                tagsEl.textContent = userInfo.topics.map(t => `#${t}`).join(' ');
            } else if (tagsEl) {
                tagsEl.textContent = '관심 분야 미설정';
            }
        }
        
        // 🚨 (옵션) 로그인 정보가 없을 경우 처리 (이 페이지는 로그인 상태여야 함)
        if (!userInfo) {
             // 닉네임 영역 등에 "로그인 필요" 등의 메시지를 표시하거나
             // window.location.href = 'login.html'; 로 리다이렉션할 수 있습니다.
        }
    }
    
    // 2. 페이지 로드 시 정보 표시 함수를 실행
    // settings-logged-in.html이 로드될 때마다 이 함수가 실행되어 최신 정보를 표시합니다.
    displayUserInfo();

    // ----------------------------------------------------
    // 3. 로그아웃 버튼 이벤트 리스너 (기존 코드)
    // ----------------------------------------------------
    // const logoutButton = document.getElementById('logout-button');
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', (e) => {
    //         e.preventDefault(); 
    //         if (confirm('정말 로그아웃 하시겠습니까?')) {
    //             // 🚨 수정: 등록 정보(user-info)는 보존하고 세션만 삭제합니다.
    //             localStorage.removeItem('current-session');
    //             alert('로그아웃되었습니다.');
    //             // 🚨 수정: settings-logged-out.html로 이동합니다. (login.html은 settings-logged-out에서 다시 연결될 수 있음)
    //             window.location.href = 'settings-logged-out.html'; 
    //         }
    //     });
    // }
    
    // ----------------------------------------------------
    // 4. 프로필 수정 버튼 이벤트 리스너 (settings -> profile-edit으로 이동)
    // ----------------------------------------------------
    const profileEditBtn = document.getElementById('profile-edit-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            // 🚨 경로 수정: profile-edit.html로 이동
            window.location.href = 'profile-edit.html'; 
        });
    }
});


// ----------------------------------------------------
// 약관 동의 창
// account.js 파일 내부에 추가
// [Terms Agreement] terms-agreement.html
// 🚨 [수정됨] 약관 동의 페이지 초기화 함수 (initTermsAgreementPage)
function initTermsAgreementPage() {
    const checkAll = document.getElementById('check-all');
    const allTerms = document.querySelectorAll('input[name="term"]');
    const requiredTerms = document.querySelectorAll('.term-item.required input[name="term"]'); 
    const nextButton = document.getElementById('next-btn-terms');
    const viewDetailLinks = document.querySelectorAll('.view-detail'); // '보기' 링크들

    // 1. 전체 동의 체크박스 클릭 시
    if (checkAll) {
        checkAll.addEventListener('change', () => {
            allTerms.forEach(checkbox => {
                checkbox.checked = checkAll.checked;
            });
        });
    }

    // 2. 개별 체크박스 클릭 시 '전체 동의' 상태 업데이트
    allTerms.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const isAllChecked = Array.from(allTerms).every(cb => cb.checked);
            checkAll.checked = isAllChecked;
        });
    });

    // 🚨 [수정됨] '보기' 링크 클릭 시 상세 내용 토글 기능
    viewDetailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 새로고침/스크롤 이동 방지
            
            const targetId = link.dataset.target; // data-target 속성에서 ID 가져오기
            const detailContent = document.getElementById(targetId);

            if (detailContent) {
                // 'show' 클래스를 토글하여 보이고 숨김
                detailContent.classList.toggle('show');
            }
        });
    });

    // 4. NEXT 버튼 클릭 시 검사 로직
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const isRequiredChecked = Array.from(requiredTerms).every(cb => cb.checked);
            if (isRequiredChecked) {
                // 모든 필수 약관에 동의했으면 다음 단계로 이동
                window.location.href = 'info-step1.html'; 
            } else {
                // 필수 약관 미동의 시 경고
                alert('필수 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.');
            }
        });
    }
}

// (메인 라우터는 그대로 유지)
