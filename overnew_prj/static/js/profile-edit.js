document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. DOM 요소 가져오기
    // ----------------------------------------------------
    const backButton = document.getElementById('back-to-settings');
    const saveButton = document.getElementById('save-profile-btn');
    
    // 프로필 필드
    const nicknameInput = document.getElementById('profile-nickname-input');
    const ageInput = document.getElementById('profile-age-input');
    
    // 체크박스 그룹
    const topicCheckboxes = document.querySelectorAll('input[name="topics"]');
    const mediaCheckboxes = document.querySelectorAll('input[name="media"]'); 


    // ----------------------------------------------------
    // 2. 로그인 확인 및 데이터 로드 (초기 진입점)
    // ----------------------------------------------------
    let userInfo = JSON.parse(localStorage.getItem('user-info') || 'null');

    // 로그인 정보 없을 경우 리다이렉션
    if (!userInfo) {
        alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
        // profile-edit.html이 account/templates/account/에 있으므로
        window.location.href = 'login.html'; 
        return; 
    }

    // ----------------------------------------------------
    // 3. 폼에 데이터 채우기 (로드 로직)
    // ----------------------------------------------------
    function loadProfileDataIntoForm() {
        if (nicknameInput) nicknameInput.value = userInfo.nickname || '';
        if (ageInput) ageInput.value = userInfo.age || '';
        
        // 성별 채우기 (Radio)
        const genderRadios = document.querySelectorAll('input[name="gender-selection"]');
        if (genderRadios && userInfo.gender) {
            genderRadios.forEach(radio => {
                if (radio.value === userInfo.gender) {
                    radio.checked = true;
                }
            });
        }
        
        // 관심 분야 채우기 (Topics Checkboxes)
        if (topicCheckboxes && userInfo.topics && Array.isArray(userInfo.topics)) {
            topicCheckboxes.forEach(checkbox => {
                if (userInfo.topics.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
        
        // 🚨 선호 언론사 채우기 (Media Checkboxes)
        if (mediaCheckboxes && userInfo.media && Array.isArray(userInfo.media)) {
            mediaCheckboxes.forEach(checkbox => {
                if (userInfo.media.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }

    // ----------------------------------------------------
    // 4. 프로필 정보 저장 함수 (저장 로직)
    // ----------------------------------------------------
    function saveProfileData() {
        // 닉네임, 나이 업데이트
        userInfo.nickname = nicknameInput.value.trim();
        userInfo.age = ageInput.value.trim();

        // 성별 업데이트 (Radio)
        const selectedGender = document.querySelector('input[name="gender-selection"]:checked');
        userInfo.gender = selectedGender ? selectedGender.value : '';

        // 관심 분야 업데이트 (Topics Checkboxes)
        const updatedTopics = [];
        topicCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                updatedTopics.push(checkbox.value);
            }
        });
        userInfo.topics = updatedTopics;

        // 🚨 선호 언론사 업데이트 (Media Checkboxes)
        const updatedMedia = [];
        mediaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                updatedMedia.push(checkbox.value);
            }
        });
        userInfo.media = updatedMedia;
        
        // 로컬 스토리지에 업데이트된 정보 저장 및 반영 완료
        localStorage.setItem('user-info', JSON.stringify(userInfo));

        alert('프로필이 성공적으로 수정되었습니다!');
        
        // 🚨 저장 후 페이지 이동: replace()를 사용하여 뒤로가기 지옥 방지
        window.location.replace('settings-logged-in.html');
    }

    // ----------------------------------------------------
    // 5. 이벤트 리스너 연결
    // ----------------------------------------------------
    
    // 저장 버튼 클릭 이벤트 연결
    if (saveButton) {
        saveButton.addEventListener('click', saveProfileData);
    }

    // 뒤로가기 버튼 처리 (settings-logged-in.html로 명시적 복귀)
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'settings-logged-in.html'; 
        });
    }

    // 페이지 로드 시 프로필 데이터 불러오기
    loadProfileDataIntoForm();
});