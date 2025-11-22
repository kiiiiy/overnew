document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.bottom-nav');
    if (!navContainer) return;

    // nav가 보여질 메인 페이지 경로
    const mainPages = [
        '/feed/',
        '/archive/',
        '/recommend/',
        '/discussion/'
    ];

    const currentPath = window.location.pathname;
    const isMainPage = mainPages.some(page => currentPath.includes(page));

    if (!isMainPage) {
       // navContainer.style.display = 'none';
        return;
    }

    const navItems = [
        { label: '피드', icon: '◆', href: '/overnew_prj/feed/templates/feed/feed.html' },
        { label: '아카이브', icon: '●', href: '/overnew_prj/archive/templates/archive/archive.html' },
        { label: '추천', icon: '▲', href: '/overnew_prj/recommend/templates/recommend/main.html' },
        { label: '커뮤니티', icon: '◐', href: '/overnew_prj/discussion/templates/discussion/community.html' },
    ];

    navContainer.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="nav-item ${currentPath.includes(item.href) ? 'active' : ''}">
            <div class="nav-icon-wrapper"><span class="nav-icon">${item.icon}</span></div>
            <span class="nav-label">${item.label}</span>
        </a>
    `).join('');

    // 햄버거 메뉴 이벤트
    const menuBtn = document.getElementById("settings-menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            window.location.href = "/overnew_prj/account/templates/account/settings-logged-in.html";
        });
    }

    // 알람 버튼 이벤트
    const alarmBtn = document.getElementById("notifications-btn");
    if (alarmBtn) {
        alarmBtn.addEventListener("click", () => {
            window.location.href = "/overnew_prj/account/templates/account/notifications.html";
        });
    }
});
