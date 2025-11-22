// =========================================================================
// 1. 전역 상태 (더미데이터 없음, 서버에서 내려준 INITIAL_COMMENTS 사용)
// =========================================================================

// 서버에서 내려준 댓글 트리
let commentTree = Array.isArray(window.INITIAL_COMMENTS) ? window.INITIAL_COMMENTS : [];

// 좋아요 상태는 로컬스토리지에만 저장 (백엔드 연동 안 함)
let likedComments = JSON.parse(localStorage.getItem('comment_likes')) || [];
let currentSortOrder = 'newest';  // 기본 최신순
let replyTarget = null;

// 로그인 유저 정보 (프론트 임시, 익명 닉네임용)
const userInfo = JSON.parse(localStorage.getItem('user-info')) || {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    avatar: null
};

// 익명 이름 매핑 (실제 userId는 "user<pk>")
const userMapping = {};

// 댓글 트리를 돌면서 userId 수집 후 익명 이름 부여
function buildUserMappingFromComments(tree) {
    const set = new Set();

    function walk(nodes) {
        nodes.forEach(node => {
            if (node.userId) set.add(node.userId);
            if (node.replies && node.replies.length > 0) {
                walk(node.replies);
            }
        });
    }

    walk(tree);

    let idx = 1;
    set.forEach(uid => {
        if (!userMapping[uid]) {
            userMapping[uid] = `익명${idx++}`;
        }
    });

    // 현재 유저도 매핑 (없으면)
    if (!userMapping[userInfo.id]) {
        userMapping[userInfo.id] = `익명${Object.keys(userMapping).length + 1}`;
    }
}

buildUserMappingFromComments(commentTree);


// =========================================================================
// 2. 헬퍼 함수들
// =========================================================================

// 댓글 HTML 생성 (재귀)
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);
    const avatarHTML = `<div class="comment-avatar anonymous-placeholder"></div>`;
    const displayName = userMapping[commentData.userId] || '알 수 없음';

    let repliesHTML = '';
    if (commentData.replies && commentData.replies.length > 0) {
        repliesHTML = commentData.replies.map(reply => createCommentHTML(reply)).join('');
    }

    return `
    <div class="comment-item ${commentData.replies && commentData.replies.length > 0 ? 'has-replies' : ''}"
         data-comment-id="${commentData.id}">
        ${avatarHTML}
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${displayName}</span>
                <span class="comment-date">${commentData.date}</span>
            </div>
            <p class="comment-text">${commentData.text}</p>
            <div class="comment-actions">
                <button class="action-btn like-btn ${isLiked ? 'active' : ''}">
                    <span>👍</span> <span class="count">${commentData.likes || 0}</span>
                </button>
                <button class="action-btn reply-btn">
                    <span>💬</span> <span class="count">${commentData.replies ? commentData.replies.length : 0}</span>
                </button>
            </div>
            <div class="reply-list">${repliesHTML}</div>
        </div>
    </div>`;
}

// 트리 정렬 (created_at을 문자열로 받았기 때문에 JS Date로 정렬)
function sortComments(tree, order = 'newest') {
    function sortNodes(nodes) {
        nodes.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
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

// 렌더링
function renderComments() {
    const container = document.getElementById('comment-list');
    if (!container) {
        console.error("ID가 'comment-list'인 요소를 찾을 수 없습니다.");
        return;
    }

    // 정렬 적용
    sortComments(commentTree, currentSortOrder);

    container.innerHTML = commentTree.map(c => createCommentHTML(c)).join('');
}

// 댓글 찾기 헬퍼
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

// 입력창 상태 업데이트 (답글 모드 / 일반 모드)
function updateCommentInputMode() {
    const input = document.getElementById('comment-input');
    const cancelBtn = document.getElementById('cancel-reply-btn');
    const parentInput = document.getElementById('parent-id-input');

    if (!input) return;

    if (replyTarget) {
        const displayName = userMapping[replyTarget.userId] || '익명';
        input.placeholder = `@${displayName} 님에게 답글 남기기`;
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (parentInput) parentInput.value = replyTarget.id; // 'c3' 같은 형태
        input.focus();
    } else {
        input.placeholder = 'Add a comment';
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (parentInput) parentInput.value = '';
    }
}


// =========================================================================
/** 3. DOMContentLoaded 후 이벤트 연결 */
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("discussion-anonymous.js DOMContentLoaded");

    const submitBtn      = document.getElementById('submit-comment-btn');
    const commentInput   = document.getElementById('comment-input');
    const myAvatar       = document.getElementById('my-avatar');
    const commentList    = document.getElementById('comment-list');
    const sortBtn        = document.getElementById('sort-btn');
    const cancelReplyBtn = document.getElementById('cancel-reply-btn');
    const backButton     = document.getElementById('back-button');
    const pinBtn         = document.getElementById('pin-btn');
    const pinnedBox      = document.getElementById('pinned-discussion-box');

    const discussionId   = document.body.dataset.roomId || 'discussion-1';

    // 아바타 설정 (임시)
    if (myAvatar) {
        myAvatar.src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';
    }

    // 초기 렌더
    renderComments();

    // 정렬 버튼
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            currentSortOrder = currentSortOrder === 'oldest' ? 'newest' : 'oldest';
            sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
            renderComments();
        });
    }

    // 답글 취소 버튼
    if (cancelReplyBtn) {
        cancelReplyBtn.addEventListener('click', () => {
            replyTarget = null;
            updateCommentInputMode();
        });
    }

    // 댓글 영역 클릭 (좋아요 / 답글)
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            const commentEl = e.target.closest('.comment-item');
            if (!commentEl) return;

            const commentId = commentEl.dataset.commentId;
            const targetComment = findCommentById(commentTree, commentId);
            if (!targetComment) return;

            // 좋아요 (프론트 전용)
            if (e.target.closest('.like-btn')) {
                const likeBtn = e.target.closest('.like-btn');
                const isLiked = likedComments.includes(commentId);

                if (isLiked) {
                    likeBtn.classList.remove('active');
                    likedComments = likedComments.filter(id => id !== commentId);
                    targetComment.likes = Math.max(0, (targetComment.likes || 0) - 1);
                } else {
                    likeBtn.classList.add('active');
                    likedComments.push(commentId);
                    targetComment.likes = (targetComment.likes || 0) + 1;
                }

                const countSpan = likeBtn.querySelector('.count');
                if (countSpan) countSpan.textContent = targetComment.likes;

                localStorage.setItem('comment_likes', JSON.stringify(likedComments));
            }

            // 답글 클릭
            if (e.target.closest('.reply-btn')) {
                replyTarget = { id: commentId, userId: targetComment.userId };
                updateCommentInputMode();
            }
        });
    }

    // submitBtn/폼은 기본 동작(POST → create_comment)에 맡기고,
    // JS에서는 내용이 비었을 때만 막아주는 정도로 사용 가능
    if (submitBtn && commentInput) {
        submitBtn.addEventListener('click', (e) => {
            if (!commentInput.value.trim()) {
                e.preventDefault();
                console.warn("댓글 입력이 비어 있습니다.");
            }
        });
    }

    // 뒤로가기 버튼
    if (backButton) {
    const backUrl = backButton.dataset.backUrl || "/community/main/";
    backButton.addEventListener("click", () => {
      console.log("[realname] back to:", backUrl);
      window.location.href = backUrl;
    });
  }

    // =========================================================================
    // 4. 핀(고정) 기능 - 프론트 로컬 (위에서 북마크는 서버용)
    // =========================================================================

    if (pinBtn && pinnedBox) {
        const storageKey     = 'pinned_discussions';
        const storageDataKey = 'pinned_discussions_data';

        let pinnedDiscussions = JSON.parse(localStorage.getItem(storageKey)) || [];
        let pinnedData        = JSON.parse(localStorage.getItem(storageDataKey)) || {};

        const discussionTitle    = document.querySelector('.article-title')?.textContent || '제목 없음';
        const discussionCategory = document.querySelector('.card-category')?.textContent || '카테고리 없음';
        const discussionSource   = document.querySelector('.card-source')?.textContent || '출처 없음';

        // 초기 버튼 상태
        if (pinnedDiscussions.includes(discussionId)) {
            pinBtn.classList.add('active');
            pinBtn.textContent = '📌 고정됨';
        } else {
            pinBtn.classList.remove('active');
            pinBtn.textContent = '📌 고정';
        }

        function renderPinnedBox() {
            if (!pinnedBox) return;

            if (pinnedDiscussions.includes(discussionId)) {
                pinnedBox.innerHTML = `
                    <div class="pinned-item" style="cursor: pointer;"
                         onclick="location.href='/community/room/${discussionId}/'">
                        📌 ${discussionTitle}
                        <button class="unpin-btn" style="margin-left:8px;cursor:pointer;">❌ 고정 해제</button>
                    </div>
                `;

                const unpinBtn = pinnedBox.querySelector('.unpin-btn');
                if (unpinBtn) {
                    unpinBtn.addEventListener('click', (event) => {
                        event.stopPropagation();

                        pinnedDiscussions = pinnedDiscussions.filter(id => id !== discussionId);
                        delete pinnedData[discussionId];

                        localStorage.setItem(storageKey, JSON.stringify(pinnedDiscussions));
                        localStorage.setItem(storageDataKey, JSON.stringify(pinnedData));

                        pinBtn.classList.remove('active');
                        pinBtn.textContent = '📌 고정';
                        renderPinnedBox();
                        alert('고정이 해제되었습니다.');
                    });
                }
            } else {
                pinnedBox.innerHTML = '';
            }
        }

        renderPinnedBox();

        pinBtn.addEventListener('click', (e) => {
            // 이 버튼은 form 안에 있으므로, 서버 북마크 토글이 우선.
            // 만약 프론트 핀만 쓰고 싶으면 e.preventDefault() 하고 여기서만 처리.
            // 지금은 북마크 POST를 쓰고 있으니 JS에서는 단순 보조 역할로 둠.
            console.log('pin button clicked (서버 북마크 동작 우선)');
        });
    }
});
