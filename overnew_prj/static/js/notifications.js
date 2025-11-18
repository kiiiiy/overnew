// 🚨 1. 시간 계산 및 포맷 함수
function formatTimeAgo(timestamp) {
    const past = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now - past) / 1000);

    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const MONTH = DAY * 30;

    if (diffSeconds < MINUTE) {
        return "방금 전";
    } else if (diffSeconds < HOUR) {
        const minutes = Math.floor(diffSeconds / MINUTE);
        return `${minutes}분 전`;
    } else if (diffSeconds < DAY) {
        const hours = Math.floor(diffSeconds / HOUR);
        return `${hours}시간 전`;
    } else if (diffSeconds < MONTH) {
        const days = Math.floor(diffSeconds / DAY);
        return `${days}일 전`;
    } else {
        // 한 달 이상 지난 경우 날짜 형식으로 표시 (예: 25/11/09)
        const year = String(past.getFullYear()).slice(-2);
        const month = String(past.getMonth() + 1).padStart(2, '0');
        const day = String(past.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }
}

// 🚨 2. 알림 상태를 관리하고 적용하는 함수
function initializeNotifications() {
    let readStates = JSON.parse(localStorage.getItem('read_notifications')) || {};
    const notificationItems = document.querySelectorAll('.notification-item');

    notificationItems.forEach(item => {
        const notifId = item.dataset.notifId;
        const notifTime = item.dataset.time; 
        const timestampElement = item.querySelector('.notif-timestamp');
        
        // 🚨 시간 계산 및 업데이트
        if (notifTime && timestampElement) {
            timestampElement.textContent = formatTimeAgo(notifTime);
        }

        // 1. 초기 상태 적용: 저장된 상태가 'true'이면 'read' 클래스를 추가
        if (notifId && readStates[notifId]) {
            item.classList.add('read');
        }

        // 2. 클릭 이벤트 리스너 추가 (읽음 표시)
        item.addEventListener('click', () => {
            if (!notifId) return;

            // 'read' 클래스 추가 (배경색 변경)
            item.classList.add('read'); 

            // 상태를 localStorage에 저장
            readStates[notifId] = true;
            localStorage.setItem('read_notifications', JSON.stringify(readStates));
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // 뒤로가기 버튼 기능
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.history.back(); 
        });
    }
    
    // 1. localStorage에서 저장된 정보 불러오기
    const userInfo = JSON.parse(localStorage.getItem('user-info'));

    // 2. (방어 코드) 만약 저장된 정보가 없으면 (로그인 안 한 상태)
    if (!userInfo || !userInfo.nickname) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html'; 
        return; 
    }

    // 3. (핵심) '나소공' 닉네임 채우기
    document.querySelectorAll('.username').forEach(element => {
        // 닉네임이 있는 곳에 사용자 닉네임을 채워줍니다.
        element.textContent = userInfo.nickname; 
    });
    
    // 🚨 4. 알림 읽음 상태 및 시간 기능 초기화
    initializeNotifications(); 
});