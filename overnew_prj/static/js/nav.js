document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.bottom-nav');
    if (!navContainer) return;

    const mainPages = [
        '/',               // 루트 경로 (피드)
        '/archive/',       // 아카이브
        '/recommend/',     // 추천
        '/discussion/'     // 커뮤니티
    ];

    const currentPath = window.location.pathname;
    const isMainPage = mainPages.some(page => currentPath.includes(page));

    if (!isMainPage) {
        navContainer.style.display = 'none';
        return;
    }

    const navItems = [
        // 🚨 [수정]: 피드는 루트 경로 '/'를 사용합니다.
        { label: '피드', icon: '◆', href: '/' },

        // 🚨 [수정]: 아카이브는 '/archive/' 경로를 사용합니다.
        // Django의 URL 패턴에 따라 정확한 경로로 수정해야 합니다.
        { label: '아카이브', icon: '●', href: '/archive/' },

        // 🚨 [수정]: 추천은 '/recommend/' 경로를 사용합니다. (main.html이 해당 뷰로 렌더링된다고 가정)
        { label: '추천', icon: '▲', href: '/recommend/' },

        // 🚨 [수정]: 커뮤니티는 '/discussion/' 경로를 사용합니다. (community.html이 해당 뷰로 렌더링된다고 가정)
        { label: '커뮤니티', icon: '◐', href: '/discussion/' },
    ];

    navContainer.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="nav-item ${currentPath.includes(item.href) ? 'active' : ''}">
            <div class="nav-icon-wrapper"><span class="nav-icon">${item.icon}</span></div>
            <span class="nav-label">${item.label}</span>
        </a>
    `).join('');

    const menuBtn = document.getElementById("settings-menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            // 🚨 [수정]: '/account/settings/' 경로를 사용합니다.
            window.location.href = "/account/settings/";
        });
    }

    // 알람 버튼 이벤트 (알림 페이지)
    const alarmBtn = document.getElementById("notifications-btn");
    if (alarmBtn) {
        alarmBtn.addEventListener("click", () => {
            // 🚨 [수정]: '/account/notifications/' 경로를 사용합니다.
            window.location.href = "/account/notifications/";
        });
    }
});