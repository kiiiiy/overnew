// static/js/community.js

// ===============================
// 토론 목록 & 고정 관리 JS (community.js)
// ===============================

// 고정된 토론 / 북마크 상태 로컬스토리지에서 불러오기
let pinnedDiscussions = JSON.parse(localStorage.getItem("pinned_discussions")) || [];
let pinnedData = JSON.parse(localStorage.getItem("pinned_discussions_data")) || {};
let bookmarkedArticles = JSON.parse(localStorage.getItem("bookmarked_articles")) || [];

// 정적 이미지 경로 (프로젝트 static 위치에 맞게 필요시 수정)
const THUMBTACK_ICON_URL = "/static/image/thumbtacks.png";

/**
 * 토론 카드 HTML 생성
 * 백엔드에서 내려주는 room JSON 구조를 기준으로 렌더링
 * {
 *   id, type, category, source, title, image,
 *   time_end, views, likes, comments,
 *   enter_url, detail_url, article_url
 * }
 */
function createDiscussionCardHTML(cardData) {
    const idStr = String(cardData.id);
    const isBookmarked = bookmarkedArticles.includes(idStr);

    const topicClassMap = {
        "IT/과학": "topic-it",
        "정치": "topic-politics",
        "경제": "topic-economy"
    };
    const categoryClass = topicClassMap[cardData.category] || "topic-default";

    const articleLink = cardData.article_url;        // ✅ 더 이상 "#” 안 넣기
    const enterLink   = cardData.enter_url || "#";
    const typeValue   = cardData.type ? cardData.type : "realname";

    const hasArticleLink = !!articleLink;            // 링크 있는지 여부

    return `
    <div class="discussion-card"
         data-article-id="${idStr}"
         data-end-time="${cardData.time_end}"
         data-detail-url="${enterLink}"
         data-type="${typeValue}">

        <span class="card-category ${categoryClass}">${cardData.category}</span>

        ${
          hasArticleLink
            ? `<a href="${articleLink}" class="card-title-link">
                   <h3 class="card-title">${cardData.title}</h3>
               </a>`
            : `<h3 class="card-title">${cardData.title}</h3>`
        }

        ${
          cardData.image
            ? `<a href="${articleLink || '#'}" class="card-image-link">
                   <img src="${cardData.image}" alt="${cardData.title}" class="discussion-card-image">
               </a>`
            : ""
        }

        <div class="discussion-card-meta">
            <span class="time-left">🕒 ${calculateRemainingTime(cardData.time_end)}</span>
        </div>

        <div class="discussion-card-footer">
            <div class="discussion-stats">
                <span>👁️ ${cardData.views}</span>
                <span>👍 ${cardData.likes}</span>
                <span>💬 ${cardData.comments}</span>
            </div>
            <div class="discussion-actions">
                <button class="icon-btn share-btn"><span>↗</span></button>
                <button class="icon-btn bookmark-btn ${isBookmarked ? "active" : ""}">
                    <span>□</span>
                </button>
            </div>
        </div>

        <a href="${enterLink}" class="discussion-join-btn">토론 참여하기</a>
    </div>`;
}


/**
 * 상단 고정 토론 렌더링
 */
function renderPinnedDiscussions() {
    const pinnedArea = document.getElementById("pinned-discussions");
    if (!pinnedArea) return;

    if (pinnedDiscussions.length === 0) {
        pinnedArea.innerHTML = `
            <h3 class="pinned-title">
                <img src="${THUMBTACK_ICON_URL}" alt="고정핀"
                     style="width: 24px; vertical-align: middle; margin-right: 8px;">
                고정된 토론
            </h3>
            <p class="no-pinned">현재 고정된 토론이 없습니다.</p>`;
        pinnedArea.style.minHeight = "100px";
        return;
    }

    const id = pinnedDiscussions[0];
    const item = pinnedData[id];
    if (!item) {
        pinnedArea.innerHTML = "";
        return;
    }

    const html = `
        <h3 class="pinned-title">
            <img src="${THUMBTACK_ICON_URL}" alt="고정핀"
                 style="width: 24px; vertical-align: middle; margin-right: 8px;">
            고정된 토론
        </h3>
        <div class="pinned-item"
             data-id="${id}"
             style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <span class="text" style="flex-grow: 1;">${item.title}</span>
            <button class="unpin-btn" style="flex-shrink: 0;">고정 삭제</button>
        </div>
    `;

    pinnedArea.innerHTML = html;

    // 클릭 이벤트: 전체 영역 클릭 시 토론 선택 페이지로 이동
    const pinnedItem = pinnedArea.querySelector(".pinned-item");
    if (pinnedItem) {
        pinnedItem.addEventListener("click", (e) => {
            if (e.target.classList.contains("unpin-btn")) return;
            const id = pinnedItem.dataset.id;
            const item = pinnedData[id];
            if (item && item.detail_url) {
                window.location.href = item.detail_url;
            }
        });
    }

    // "고정 삭제" 버튼 클릭
    const unpinBtn = pinnedArea.querySelector(".unpin-btn");
    if (unpinBtn) {
        unpinBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const parent = e.target.closest(".pinned-item");
            const id = parent.dataset.id;

            pinnedDiscussions = pinnedDiscussions.filter((x) => x !== id);
            delete pinnedData[id];

            localStorage.setItem(
                "pinned_discussions",
                JSON.stringify(pinnedDiscussions)
            );
            localStorage.setItem(
                "pinned_discussions_data",
                JSON.stringify(pinnedData)
            );

            renderPinnedDiscussions();
            renderFeed();
        });
    }
}

/**
 * 새로운 토론을 고정
 */
function pinDiscussion(discussionId, discussionData) {
    // 기존 고정된 토론 제거 (하나만 유지)
    if (pinnedDiscussions.length > 0) {
        const currentPinnedId = pinnedDiscussions[0];
        pinnedDiscussions = [];
        delete pinnedData[currentPinnedId];
    }

    pinnedDiscussions.push(String(discussionId));
    pinnedData[String(discussionId)] = {
        id: String(discussionId),
        title: discussionData.title,
        type: discussionData.type || "realname",
        detail_url: discussionData.detail_url || "",
    };

    localStorage.setItem(
        "pinned_discussions",
        JSON.stringify(pinnedDiscussions)
    );
    localStorage.setItem(
        "pinned_discussions_data",
        JSON.stringify(pinnedData)
    );

    renderPinnedDiscussions();
}

/**
 * 현재 선택된 카테고리(nc_id)에 맞는 토론방 목록을 API로부터 불러와 렌더링
 */
function renderFeed() {
    const feedContainer = document.getElementById("discussion-list");
    if (!feedContainer) return;

    const activeTag = document.querySelector(".keyword-tag.active");
    if (!activeTag) {
        feedContainer.innerHTML =
            '<p class="error-text">카테고리가 선택되지 않았습니다.</p>';
        return;
    }

    const ncId = activeTag.dataset.ncId;
    if (!ncId) {
        feedContainer.innerHTML =
            '<p class="error-text">유효한 카테고리 ID가 없습니다.</p>';
        return;
    }

    feedContainer.innerHTML = '<p class="loading-text">불러오는 중...</p>';

    const pageType = document.body.dataset.pageType || "all";

    // 🔥 URL 확인: project urls.py 에서 community/ 로 include 했으면 이게 맞음
    fetch(`/community/api/rooms/?nc_id=${encodeURIComponent(ncId)}`)
        .then((res) => res.json())
        .then((data) => {
            const rooms = data.rooms || [];

            if (rooms.length === 0) {
                feedContainer.innerHTML =
                    '<p class="no-rooms">현재 진행 중인 토론이 없습니다.</p>';
                return;
            }

            let html = "";
            rooms.forEach((room) => {
                // 페이지 타입에 따라 실명/익명 필터링
                if (pageType !== "all" && room.type !== pageType) {
                    return;
                }
                html += createDiscussionCardHTML(room);
            });

            if (!html) {
                feedContainer.innerHTML =
                    '<p class="no-rooms">현재 진행 중인 토론이 없습니다.</p>';
            } else {
                feedContainer.innerHTML = html;
            }

            updateDiscussionTimes();
        })
        .catch((err) => {
            console.error("[community.js] /community/api/rooms/ 에러:", err);
            feedContainer.innerHTML =
                '<p class="error-text">토론 목록을 불러오지 못했습니다.</p>';
        });
}

/**
 * 종료 시각까지 남은 시간 텍스트를 계산
 */
function calculateRemainingTime(endTime) {
    if (!endTime) return "종료 시각 정보 없음";

    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (isNaN(end.getTime())) {
        return "종료 시각 정보 없음";
    }

    if (diff <= 0) return "종료됨";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}시간 ${minutes}분 남음`;
    } else {
        return `${minutes}분 남음`;
    }
}

/**
 * 모든 카드의 남은 시간 텍스트 갱신
 */
function updateDiscussionTimes() {
    const cards = document.querySelectorAll(".discussion-card");
    cards.forEach((card) => {
        const timeElement = card.querySelector(".time-left");
        const endTime = card.dataset.endTime;
        if (timeElement && endTime) {
            timeElement.textContent = `🕒 ${calculateRemainingTime(endTime)}`;
        }
    });
}

/**
 * DOM 로드 후 이벤트 바인딩
 */
document.addEventListener("DOMContentLoaded", () => {
    // 카테고리 태그 클릭 시 필터 변경
    const tags = document.querySelectorAll(".keyword-tag");
    tags.forEach((tag) => {
        tag.addEventListener("click", () => {
            tags.forEach((t) => t.classList.remove("active"));
            tag.classList.add("active");
            renderFeed();
        });
    });

    // 토론 카드 내부 버튼들(공유, 북마크, 참여하기) 이벤트 위임
    const list = document.getElementById("discussion-list");
    if (list) {
        list.addEventListener("click", (e) => {
            const card = e.target.closest(".discussion-card");
            if (!card) return;

            const id = String(card.dataset.articleId);
            const detailUrl = card.dataset.detailUrl;
            const type = card.dataset.type || "realname";

            // 공유 버튼
            if (e.target.closest(".share-btn")) {
                const fullUrl = detailUrl
                    ? location.origin + detailUrl
                    : location.href;

                navigator.clipboard
                    .writeText(fullUrl)
                    .then(() => {
                        alert("공유 링크가 복사되었습니다:\n" + fullUrl);
                    })
                    .catch((err) => {
                        console.error("클립보드 복사 실패:", err);
                        alert("공유 링크를 복사하는 데 실패했습니다.");
                    });
                return;
            }

            // 북마크 버튼
            if (e.target.closest(".bookmark-btn")) {
                const btn = e.target.closest(".bookmark-btn");
                btn.classList.toggle("active");

                if (btn.classList.contains("active")) {
                    if (!bookmarkedArticles.includes(id)) {
                        bookmarkedArticles.push(id);
                    }
                } else {
                    bookmarkedArticles = bookmarkedArticles.filter(
                        (x) => x !== id
                    );
                }

                localStorage.setItem(
                    "bookmarked_articles",
                    JSON.stringify(bookmarkedArticles)
                );
                return;
            }

            // "토론 참여하기" 버튼 → 고정 및 선택 페이지로 이동
            if (e.target.closest(".discussion-join-btn")) {
                const title =
                    card.querySelector(".card-title")?.textContent || "";
                const enterUrl = detailUrl;

                if (!pinnedDiscussions.includes(id)) {
                    pinDiscussion(id, {
                        title: title,
                        type: type,
                        detail_url: enterUrl,
                    });
                }

                if (enterUrl) {
                    // <a> 기본 동작으로도 이동하지만, 확실히 하기 위해
                    window.location.href = enterUrl;
                }
                return;
            }
        });
    }

    // 주기적으로 남은 시간 업데이트 (1분마다)
    setInterval(updateDiscussionTimes, 60000);

    // 초기 렌더링
    renderPinnedDiscussions();
    renderFeed();
    updateDiscussionTimes();
});
