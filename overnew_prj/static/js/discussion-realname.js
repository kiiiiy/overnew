// static/js/discussion-realname.js

// ====================================================================
// 0. CSRF 쿠키 헬퍼
// ====================================================================
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

// ====================================================================
// 1. 전역 상태 – 서버에서 내려준 INITIAL_COMMENTS 사용
// ====================================================================

let commentTree = Array.isArray(window.INITIAL_COMMENTS)
  ? window.INITIAL_COMMENTS
  : [];

let currentSortOrder = "newest"; // 'newest' or 'oldest'
let replyTarget = null; // { id: 3, display_name: '홍길동' }

// ====================================================================
// 2. 헬퍼 함수들
// ====================================================================

function createCommentHTML(node) {
  const avatarHTML = `<div class="comment-avatar realname-placeholder"></div>`;
  const displayName = node.display_name || node.username || "사용자";
  const isLiked = !!node.is_liked;

  let repliesHTML = "";
  if (node.replies && node.replies.length > 0) {
    repliesHTML = node.replies.map((child) => createCommentHTML(child)).join("");
  }

  return `
    <div class="comment-item ${
      node.replies && node.replies.length > 0 ? "has-replies" : ""
    }" data-comment-id="${node.id}">
        ${avatarHTML}
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${displayName}</span>
                <span class="comment-date">${node.date}</span>
            </div>
            <p class="comment-text">${node.text}</p>
            <div class="comment-actions">
                <button class="action-btn like-btn ${isLiked ? "active" : ""}">
                    <span>👍</span> <span class="count">${node.likes || 0}</span>
                </button>
                <button class="action-btn reply-btn">
                    <span>💬</span> <span class="count">${
                      node.replies ? node.replies.length : 0
                    }</span>
                </button>
            </div>
            <div class="reply-list">
                ${repliesHTML}
            </div>
        </div>
    </div>
  `;
}

// 🔧 숫자/문자 타입 맞춰서 찾기
function findCommentById(list, id) {
  const targetId = Number(id);
  for (let c of list) {
    if (Number(c.id) === targetId) return c;
    if (c.replies && c.replies.length > 0) {
      const found = findCommentById(c.replies, targetId);
      if (found) return found;
    }
  }
  return null;
}

function updateCommentInputMode() {
  const input = document.getElementById("comment-input");
  const cancelBtn = document.getElementById("cancel-reply-btn");
  const parentInput = document.getElementById("parent-id-input");

  if (!input) return;

  if (replyTarget) {
    const displayName = replyTarget.display_name || "사용자";
    input.placeholder = `@${displayName} 님에게 답글 남기기`;
    if (cancelBtn) cancelBtn.style.display = "inline-block";
    if (parentInput) parentInput.value = replyTarget.id;
    input.focus();
  } else {
    input.placeholder = "Add a comment";
    if (cancelBtn) cancelBtn.style.display = "none";
    if (parentInput) parentInput.value = "";
  }
}

// ====================================================================
// 3. 정렬 & 렌더링
// ====================================================================

function sortComments(tree, order = 'newest') {
    function sortNodes(nodes) {
        nodes.sort((a, b) => {
            // created_at(ISO) 있으면 그걸 쓰고, 없으면 기존 date 사용
            const dateA = new Date(a.created_at || a.date);
            const dateB = new Date(b.created_at || b.date);
            return order === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        nodes.forEach(n => {
            if (n.replies && n.replies.length > 0) {
                sortNodes(n.replies);
            }
        });
    }

    sortNodes(tree);
}

function renderComments() {
  const container = document.getElementById("comment-list");
  if (!container) return;

  sortComments(commentTree, currentSortOrder);
  container.innerHTML = commentTree.map((c) => createCommentHTML(c)).join("");

  console.log("[realname] renderComments / order =", currentSortOrder);
}

// ====================================================================
// 4. DOMContentLoaded – 이벤트 연결
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-comment-btn");
  const commentInput = document.getElementById("comment-input");
  const myAvatar = document.getElementById("my-avatar");
  const commentList = document.getElementById("comment-list");
  const sortBtn = document.getElementById("sort-btn");
  const cancelReplyBtn = document.getElementById("cancel-reply-btn");
  const backButton = document.getElementById("back-button");
  const pinBtn = document.getElementById("pin-btn");
  const pinnedBox = document.getElementById("pinned-discussion-box");

  const discussionId = document.body.dataset.roomId || "discussion-1";

  if (myAvatar) {
    // 나중에 실제 프로필 이미지 연동 가능
  }

  if (sortBtn) {
    sortBtn.innerHTML = `<span>⇅</span> ${
      currentSortOrder === "oldest" ? "오래된순" : "최신순"
    }`;
  }

  renderComments();

  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      currentSortOrder = currentSortOrder === "oldest" ? "newest" : "oldest";
      sortBtn.innerHTML = `<span>⇅</span> ${
        currentSortOrder === "oldest" ? "오래된순" : "최신순"
      }`;
      console.log("[realname] sort changed:", currentSortOrder);
      renderComments();
    });
  }

  if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener("click", () => {
      replyTarget = null;
      updateCommentInputMode();
    });
  }

  if (commentList) {
    commentList.addEventListener("click", (e) => {
      const commentEl = e.target.closest(".comment-item");
      if (!commentEl) return;

      const commentId = commentEl.dataset.commentId;
      const targetComment = findCommentById(commentTree, commentId);
      if (!targetComment) return;

      // 👍 서버 좋아요
      if (e.target.closest(".like-btn")) {
        e.preventDefault();
        const likeBtn = e.target.closest(".like-btn");

        fetch(`/discussion/comment/${commentId}/like/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
            "X-Requested-With": "XMLHttpRequest",
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to toggle like");
            return res.json();
          })
          .then((data) => {
            if (data.liked) {
              likeBtn.classList.add("active");
            } else {
              likeBtn.classList.remove("active");
            }

            const countSpan = likeBtn.querySelector(".count");
            if (countSpan) {
              countSpan.textContent = data.like_count;
            }

            targetComment.likes = data.like_count;
            targetComment.is_liked = data.liked;
          })
          .catch((err) => {
            console.error("[realname] 댓글 좋아요 토글 실패:", err);
            alert("좋아요 처리 중 오류가 발생했습니다. (로그인이 필요할 수 있어요)");
          });

        return;
      }

      // 💬 답글
      if (e.target.closest(".reply-btn")) {
        replyTarget = {
          id: commentId,
          display_name:
            targetComment.display_name ||
            targetComment.username ||
            "사용자",
        };
        updateCommentInputMode();
      }
    });
  }

  if (submitBtn && commentInput) {
    submitBtn.addEventListener("click", (e) => {
      if (!commentInput.value.trim()) {
        e.preventDefault();
        console.warn("[realname] 댓글 입력이 비어 있습니다.");
      }
    });
  }

  if (backButton) {
    const backUrl = backButton.dataset.backUrl || "/community/main/";
    backButton.addEventListener("click", () => {
      console.log("[realname] back to:", backUrl);
      window.location.href = backUrl;
    });
  }

  // 핀(고정) – 익명이랑 동일하게 쓰고 싶으면 여기 채우면 됨
  if (pinBtn && pinnedBox) {
    // 지금은 서버 북마크(form) 우선이라 JS에서 추가로 안 해도 OK
  }
});
