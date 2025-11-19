document.addEventListener('DOMContentLoaded', () => {
    // 요소 가져오기 (HTML ID/Name과 일치하는지 확인)
    const backButton = document.getElementById('back-to-settings');
    const saveButton = document.getElementById('save-profile-btn'); // 🚨 저장 버튼 ID 사용
    
    const nicknameInput = document.getElementById('profile-nickname-input');
    const ageInput = document.getElementById('profile-age-input');
    const topicCheckboxes = document.querySelectorAll('input[name="topics"]');

    // 1. 로그인 여부 확인 및 정보 로드 (유지)
    let userInfo = JSON.parse(localStorage.getItem('user-info') || 'null');

    if (!userInfo) {
        alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
        // 🚨 경로 수정: profile-edit.html에서 login.html로 이동
        window.location.href = '../login.html'; 
        return; 
    }

    // 2. 현재 사용자 정보 폼에 채우기 (유지)
    function loadProfileDataIntoForm() {
        if (nicknameInput) nicknameInput.value = userInfo.nickname || '';
        
        // 성별 채우기
        const genderRadios = document.querySelectorAll('input[name="gender-selection"]');
        if (genderRadios && userInfo.gender) {
            genderRadios.forEach(radio => {
                if (radio.value === userInfo.gender) {
                    radio.checked = true;
                }
            });
        }
        
        if (ageInput) ageInput.value = userInfo.age || '';

        // 관심 분야 채우기
        if (topicCheckboxes && userInfo.topics && Array.isArray(userInfo.topics)) {
            topicCheckboxes.forEach(checkbox => {
                if (userInfo.topics.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }

    // 3. 프로필 정보 저장 함수 (버튼 클릭 시 실행)
    function saveProfileData() {
        // 닉네임 업데이트
        userInfo.nickname = nicknameInput.value.trim();

        // 성별 업데이트
        const selectedGender = document.querySelector('input[name="gender-selection"]:checked');
        userInfo.gender = selectedGender ? selectedGender.value : '';

        // 나이 업데이트
        userInfo.age = ageInput.value.trim();

        // 관심 분야 업데이트 (체크된 모든 항목)
        const updatedTopics = [];
        topicCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                updatedTopics.push(checkbox.value);
            }
        });
        userInfo.topics = updatedTopics;

        // 4. 로컬 스토리지에 업데이트된 정보 저장 및 반영 완료
        localStorage.setItem('user-info', JSON.stringify(userInfo));

        alert('프로필이 성공적으로 수정되었습니다!');
        
        // 🚨 저장 후 페이지 이동 (같은 폴더 내의 설정 페이지로 이동)
        window.location.href = 'settings-logged-in.html'; 
    }

    // --- 이벤트 리스너 연결 ---

    // 🚨 저장 버튼 클릭 이벤트 연결
    if (saveButton) {
        saveButton.addEventListener('click', saveProfileData);
    }

    // 4. 뒤로가기 버튼 처리 (유지)
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 🚨 뒤로가기 시 설정 페이지로 이동
            window.location.href = 'settings-logged-in.html'; 
        });
    }

    // 페이지 로드 시 프로필 데이터 불러오기
    loadProfileDataIntoForm();
});