document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.bottom-nav');
    if (!navContainer) return;

<<<<<<< HEAD
    // 실제 프로젝트에 존재하는 main 페이지들
    const mainPages = [
    '/overnew_prj/feed/templates/feed/feed.html',
    '/overnew_prj/archive/templates/archive/archive.html',
    '/overnew_prj/recommend/templates/recommend/main.html',
    '/overnew_prj/discussion/templates/discussion/community.html',
    '/overnew_prj/discussion/templates/discussion/discussion-anonymous.html', 
    
    '/overnew_prj/discussion/templates/discussion/discussion-detail.html', 
    '/overnew_prj/discussion/templates/discussion/discussion-realname.html' 
];



    const currentPath = window.location.pathname;
    const isMainPage = mainPages.some(page => currentPath.endsWith(page));
=======
    // nav가 보여질 메인 페이지 경로
    const mainPages = [
        '/feed.html',
        '/archive.html',
        '/main.html',
        '/community.html'
    ];

    const currentPath = window.location.pathname;
    const isMainPage = mainPages.some(page => currentPath.includes(page));
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982

    if (!isMainPage) {
        navContainer.style.display = 'none';
        return;
    }

    const navItems = [
        { label: '피드', icon: '◆', href: '/overnew_prj/feed/templates/feed/feed.html' },
        { label: '아카이브', icon: '●', href: '/overnew_prj/archive/templates/archive/archive.html' },
        { label: '추천', icon: '▲', href: '/overnew_prj/recommend/templates/recommend/main.html' },
        { label: '커뮤니티', icon: '◐', href: '/overnew_prj/discussion/templates/discussion/community.html' },
    ];

    navContainer.innerHTML = navItems.map(item => `
<<<<<<< HEAD
        <a href="${item.href}" class="nav-item ${currentPath.endsWith(item.href) ? 'active' : ''}">
=======
        <a href="${item.href}" class="nav-item ${currentPath.includes(item.href) ? 'active' : ''}">
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
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
<<<<<<< HEAD
    document.getElementById("back-button").addEventListener("click", function () {
    history.back();
});
=======
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
});
