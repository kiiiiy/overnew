// static/js/discussion-realname.js

// ====================================================================
// 1. 전역 상태 – 서버에서 내려준 INITIAL_COMMENTS 사용
// ====================================================================

// Django 템플릿에서 내려준 전역 변수
// <script> window.INITIAL_COMMENTS = JSON.parse(`...`); </script>
let commentTree = Array.isArray(window.INITIAL_COMMENTS)
  ? window.INITIAL_COMMENTS
  : [];

let likedComments = JSON.parse(localStorage.getItem("realname_comment_likes")) || [];
let currentSortOrder = "newest"; // 'newest' or 'oldest'
let replyTarget = null; // { id: 'c3', display_name: '홍길동' }


// ====================================================================
// 2. 헬퍼 함수들
// ====================================================================

// 댓글 하나에 대한 HTML 생성 (재귀)
function createCommentHTML(node) {
  const isLiked = likedComments.includes(node.id);
  const avatarHTML = `<div class="comment-avatar realname-placeholder"></div>`;
  const displayName = node.display_name || node.username || "사용자";

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

// 트리에서 id로 댓글 찾기
function findCommentById(list, id) {
  for (let c of list) {
    if (c.id === id) return c;
    if (c.replies && c.replies.length > 0) {
      const found = findCommentById(c.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// 입력창 상태 (답글 ↔ 일반)
function updateCommentInputMode() {
  const input = document.getElementById("comment-input");
  const cancelBtn = document.getElementById("cancel-reply-btn");
  const parentInput = document.getElementById("parent-id-input");

  if (!input) return;

  if (replyTarget) {
    const displayName = replyTarget.display_name || "사용자";
    input.placeholder = `@${displayName} 님에게 답글 남기기`;
    if (cancelBtn) cancelBtn.style.display = "inline-block";
    if (parentInput) parentInput.value = replyTarget.id; // 'c3' 같은 형태
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

// 🔥 정렬 로직을 단순화: 서버에서 이미 오래된순으로 내려준다는 가정
// - currentSortOrder === 'oldest' → 그대로
// - currentSortOrder === 'newest' → 최상위 댓글만 역순
function getSortedTree() {
  if (currentSortOrder === "oldest") {
    return commentTree.slice(); // 원본 유지
  } else {
    return commentTree.slice().reverse(); // 최신순: 역순으로
  }
}

function renderComments() {
  const container = document.getElementById("comment-list");
  if (!container) return;

  const sorted = getSortedTree();
  container.innerHTML = sorted.map((c) => createCommentHTML(c)).join("");

  console.log("[realname] renderComments / order =", currentSortOrder, sorted);
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

  // 아바타: 지금은 템플릿에서 placeholder 이미지 사용 중
  if (myAvatar) {
    // 나중에 실제 프로필 이미지 연동하면 여기서 교체
  }

  // 🔹 초기 정렬 버튼 텍스트 세팅
  if (sortBtn) {
    sortBtn.innerHTML = `<span>⇅</span> ${
      currentSortOrder === "oldest" ? "오래된순" : "최신순"
    }`;
  }

  // 🔹 초기 댓글 렌더
  renderComments();

  // 정렬 버튼 클릭
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

  // 답글 취소 버튼
  if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener("click", () => {
      replyTarget = null;
      updateCommentInputMode();
    });
  }

  // 댓글 영역 클릭 (좋아요 / 답글)
  if (commentList) {
    commentList.addEventListener("click", (e) => {
      const commentEl = e.target.closest(".comment-item");
      if (!commentEl) return;

      const commentId = commentEl.dataset.commentId;
      const targetComment = findCommentById(commentTree, commentId);
      if (!targetComment) return;

      // 👍 좋아요 (프론트 로컬)
      if (e.target.closest(".like-btn")) {
        const likeBtn = e.target.closest(".like-btn");
        const isLiked = likedComments.includes(commentId);

        if (isLiked) {
          likeBtn.classList.remove("active");
          likedComments = likedComments.filter((id) => id !== commentId);
          targetComment.likes = Math.max(0, (targetComment.likes || 0) - 1);
        } else {
          likeBtn.classList.add("active");
          likedComments.push(commentId);
          targetComment.likes = (targetComment.likes || 0) + 1;
        }

        const countSpan = likeBtn.querySelector(".count");
        if (countSpan) countSpan.textContent = targetComment.likes;

        localStorage.setItem(
          "realname_comment_likes",
          JSON.stringify(likedComments)
        );
      }

      // 💬 답글 모드 진입
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

  // 제출 버튼: 내용 비어 있으면 막기
  if (submitBtn && commentInput) {
    submitBtn.addEventListener("click", (e) => {
      if (!commentInput.value.trim()) {
        e.preventDefault();
        console.warn("[realname] 댓글 입력이 비어 있습니다.");
      }
      // 실제 저장은 Django form이 처리 (create_comment 뷰)
    });
  }

  // 뒤로가기
  if (backButton) {
    const backUrl = backButton.dataset.backUrl || "/community/main/";
    backButton.addEventListener("click", () => {
      console.log("[realname] back to:", backUrl);
      window.location.href = backUrl;
    });
  }

  // 핀 버튼: 지금은 서버북마크(form) 기준이라 JS에서 굳이 뭘 안 해도 됨
  if (pinBtn) {
    // 필요하면 나중에 로컬 UI 효과 추가 가능
  }
});
