// article.js

// ----- 1. 더미 데이터 (기사 목록) -----
const dummyArticles = [
    {
        id: 'dog-meeting',
        category: '생활/문화',
        source: '노트펫',
        title: "강아지 놀이터에서 헤어진 강아지가 다시 만날 확률은... '첫눈에 알아봤댕!'",
        dateCreated: '2025.10.20 18:48:02',
        dateUpdated: '2025.11.09 09:48:15',
        author: '김기자: papercut@inbnat.co.kr',
        body: [
            "[노트펫] 중증보호소에서 헤어진 강아지 남매가 다시 만날 확률은 얼마나 될까?",
            "보호소에서 다른 무리들에게 각각 입양된 강아지 남매가...서로를 알아봤다고 미국 시사주간지 뉴스위크가 전했다.",
            "동희니 송이 지난 2020년 틱톡에 올린 동영상이...화제가 됐다. 이 영상은 28만건 넘는 '좋아요'를 받았다."
        ],
        mainImage: 'dog-meeting-image.jpg',
        embeddedImage: 'dog-tiktok-image.jpg'
    },
    {
        id: 'apec-market',
        category: '경제',
        source: 'SBS',
        title: 'APEC 효과?... 경제 뉴스 샘플',
        dateCreated: '2025.11.01 10:20:00',
        dateUpdated: '2025.11.10 09:00:00',
        author: '경제 기자',
        body: [
            "APEC 관련 경제 뉴스 샘플 내용입니다.",
            "주식 시장과 환율에 영향이 있다고 합니다."
        ],
        mainImage: 'apec-market.jpg',
        embeddedImage: 'apec-market-embed.jpg'
    }
];

// ----- 2. DOMContentLoaded -----
document.addEventListener('DOMContentLoaded', () => {

    const articleData = JSON.parse(localStorage.getItem('selected_article'));
    if (!articleData) return;

    // HTML 요소 채우기
    const titleEl = document.querySelector('.article-title');
    const metaEl = document.querySelector('.article-meta');
    const bodyEl = document.querySelector('.article-body');
    const mainImgEl = document.querySelector('.article-figure img');
    const captionEl = document.querySelector('.article-caption');
    const embeddedEl = document.querySelector('.article-embedded-content img');

    if (titleEl) titleEl.textContent = articleData.title;
    if (metaEl) metaEl.innerHTML = `
        <span>작성일: ${articleData.dateCreated}</span>
        <span>수정일: ${articleData.dateUpdated}</span>
        <span>${articleData.author}</span>
    `;
    if (bodyEl) bodyEl.innerHTML = articleData.body.map(p => `<p>${p}</p>`).join('');
    if (mainImgEl) mainImgEl.src = articleData.mainImage;
    if (captionEl) captionEl.textContent = articleData.title;
    if (embeddedEl) embeddedEl.src = articleData.embeddedImage;

});
// ----- article.js -----
// 아티클 상세 페이지의 좋아요, 댓글, 북마크 버튼 토글
document.addEventListener('DOMContentLoaded', () => {
    ['like-btn', 'discuss-btn', 'bookmark-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => btn.classList.toggle('active'));
    });
});
