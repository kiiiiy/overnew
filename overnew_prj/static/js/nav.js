// static/js/nav.js

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.bottom-nav');
    if (!navContainer) return;

    const currentPath = window.location.pathname;

    // ✅ 하단 네비를 노출할 URL prefix (Django URL 기준)
    const mainPrefixes = [
        '/feed/',        // 피드
        '/archive/',     // 아카이브
        '/recommend/',   // 추천
        '/community/',   // 커뮤니티/토론 메인 & 방들 (예: /community/room/1/)
    ];

    const isMainPage = mainPrefixes.some(prefix => currentPath.startsWith(prefix));

    // 메인 페이지가 아니면 네비 숨김
    if (!isMainPage) {
        navContainer.style.display = 'none';
        return;
    }

    // ✅ 네비게이션 항목들
    const navItems = [
        { label: '피드',    icon: '◆', href: '/feed/' },
        { label: '아카이브', icon: '●', href: '/archive/' },
        { label: '추천',    icon: '▲', href: '/recommend/' },
        { label: '커뮤니티', icon: '◐', href: '/community/' },
    ];

    // ✅ 현재 URL 기준으로 active 클래스 부여
    navContainer.innerHTML = navItems.map(item => {
        const isActive = currentPath.startsWith(item.href);
        return `
            <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
                <div class="nav-icon-wrapper">
                    <span class="nav-icon">${item.icon}</span>
                </div>
                <span class="nav-label">${item.label}</span>
            </a>
        `;
    }).join('');

    // ✅ 햄버거 메뉴 버튼 (id="settings-menu-btn" 이 있는 경우에만 동작)
    const menuBtn = document.getElementById("settings-menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            window.location.href = "/account/settings/";   // 실제 URL에 맞게 수정해서 사용
        });
    }

    // ✅ 알림 버튼 (id="notifications-btn" 이 있는 경우에만 동작)
    const alarmBtn = document.getElementById("notifications-btn");
    if (alarmBtn) {
        alarmBtn.addEventListener("click", () => {
            window.location.href = "/account/notifications/";  // 실제 URL에 맞게 수정
        });
    }

    // ✅ 뒤로가기 버튼 (있는 페이지에서만 동작)
    const backBtn = document.getElementById("back-button");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            history.back();
        });
    }
});
