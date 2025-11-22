// ========================================================================
// 0. CSRF 쿠키 헬퍼
// ========================================================================
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// ========================================================================
// 1. 전역 상태 (서버에서 내려준 INITIAL_COMMENTS 사용)
// ========================================================================

// views.py 에서 comments_json 내려준 걸 템플릿에서 이렇게 넣었지:
// window.INITIAL_COMMENTS = JSON.parse(`{{ comments_json|escapejs }}`);
let commentTree = Array.isArray(window.INITIAL_COMMENTS)
    ? window.INITIAL_COMMENTS
    : [];

let currentSortOrder = 'newest';
let replyTarget = null;     // { id: 3, display_name: '익명1' }

// 로그인 유저 정보 (익명방이지만 로컬에서 아바타용)
const userInfo = JSON.parse(localStorage.getItem('user-info')) || {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    avatar: null,
};

// 익명 이름 매핑 (실제 userId는 user의 pk or null)
const userMapping = {};

// 트리에서 userId 모아서 "익명1, 익명2..." 붙이기
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

    // 현재 유저용 (userInfo.id는 로컬 guest id라, 그냥 하나 붙여줌)
    if (!userMapping[userInfo.id]) {
        userMapping[userInfo.id] = `익명${Object.keys(userMapping).length + 1}`;
    }
}

// 처음 한 번 계산
buildUserMappingFromComments(commentTree);

// ========================================================================
// 2. 헬퍼 함수들
// ========================================================================

// 재귀로 id로 댓글 찾기 (대댓글까지)
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

function createCommentHTML(commentData) {
    const avatarHTML = `<div class="comment-avatar anonymous-placeholder"></div>`;
    const displayName =
        userMapping[commentData.userId] ||
        commentData.display_name ||
        '알 수 없음';
    const isLiked = !!commentData.is_liked;
    const replies = commentData.replies || [];

    let repliesHTML = '';
    if (replies.length > 0) {
        repliesHTML = replies.map(reply => createCommentHTML(reply)).join('');
    }

    return `
    <div class="comment-item ${replies.length > 0 ? 'has-replies' : ''}"
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
                    <span>💬</span> <span class="count">${replies.length}</span>
                </button>
            </div>
            <div class="reply-list">
                ${repliesHTML}
            </div>
        </div>
    </div>
    `;
}

// 댓글 입력창 상태 업데이트 (답글/일반)
function updateCommentInputMode() {
    const input = document.getElementById('comment-input');
    const cancelBtn = document.getElementById('cancel-reply-btn');
    const parentInput = document.getElementById('parent-id-input');

    if (!input) return;

    if (replyTarget) {
        const displayName = replyTarget.display_name || '익명';
        input.placeholder = `@${displayName} 님에게 답글 남기기`;
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (parentInput) parentInput.value = replyTarget.id;
        input.focus();
    } else {
        input.placeholder = 'Add a comment';
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (parentInput) parentInput.value = '';
    }
}

// ========================================================================
// 3. 정렬 + 렌더링
// ========================================================================

function sortComments(tree, order = 'newest') {
    function sortNodes(nodes) {
        nodes.sort((a, b) => {
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
    const commentContainer = document.getElementById('comment-list');
    if (!commentContainer) return;

    // 정렬
    sortComments(commentTree, currentSortOrder);
    // 익명 이름 매핑 갱신
    buildUserMappingFromComments(commentTree);

    commentContainer.innerHTML = commentTree
        .map(comment => createCommentHTML(comment))
        .join('');
}

// ========================================================================
// 4. DOMContentLoaded 이벤트
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const commentList = document.getElementById('comment-list');
    const sortBtn = document.getElementById('sort-btn');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('submit-comment-btn');
    const myAvatarEl = document.getElementById('my-avatar');
    const cancelReplyBtn = document.getElementById('cancel-reply-btn');
    const backButton = document.getElementById('back-button');

    // 아바타 (로그인 여부 상관없이 기본 이미지 or 저장된 아바타)
    const storedUserInfo = JSON.parse(localStorage.getItem('user-info'));
    const effectiveUserInfo = storedUserInfo || userInfo;

    if (myAvatarEl) {
        myAvatarEl.src =
            effectiveUserInfo.avatar ||
            'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';
    }

    // 정렬 버튼 초기 텍스트
    if (sortBtn) {
        sortBtn.innerHTML = `<span>⇅</span> ${
            currentSortOrder === 'oldest' ? '오래된순' : '최신순'
        }`;
    }

    // 첫 렌더
    renderComments();

    // 정렬 버튼 클릭
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            currentSortOrder =
                currentSortOrder === 'oldest' ? 'newest' : 'oldest';
            sortBtn.innerHTML = `<span>⇅</span> ${
                currentSortOrder === 'oldest' ? '오래된순' : '최신순'
            }`;
            renderComments();
        });
    }

    // 뒤로가기 (main 으로)
    backButton.addEventListener("click", () => {
    if (document.referrer && document.referrer !== "") {
        history.back();
    } else {
        // 직접 주소로 들어온 경우 안전한 fallback
        window.location.href = "/community/main/";
    }
});

    // 답글 취소 버튼
    if (cancelReplyBtn) {
        cancelReplyBtn.addEventListener('click', () => {
            replyTarget = null;
            updateCommentInputMode();
        });
    }

    // 댓글 리스트에서 좋아요 / 답글
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            const commentEl = e.target.closest('.comment-item');
            if (!commentEl) return;

            const commentId = commentEl.dataset.commentId;
            const targetComment = findCommentById(commentTree, commentId);
            if (!targetComment) return;

            // 👍 좋아요
            if (e.target.closest('.like-btn')) {
                e.preventDefault();
                const likeBtn = e.target.closest('.like-btn');

                fetch(`/discussion/comment/${commentId}/like/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                })
                    .then((res) => {
                        if (!res.ok) throw new Error('Failed to toggle like');
                        return res.json();
                    })
                    .then((data) => {
                        if (data.liked) {
                            likeBtn.classList.add('active');
                        } else {
                            likeBtn.classList.remove('active');
                        }

                        const countSpan = likeBtn.querySelector('.count');
                        if (countSpan) {
                            countSpan.textContent = data.like_count;
                        }

                        targetComment.likes = data.like_count;
                        targetComment.is_liked = data.liked;
                    })
                    .catch((err) => {
                        console.error('[anonymous] 댓글 좋아요 토글 실패:', err);
                        alert('좋아요 처리 중 오류가 발생했습니다.');
                    });

                return;
            }

            // 💬 답글
            if (e.target.closest('.reply-btn')) {
                replyTarget = {
                    id: commentId,
                    display_name:
                        userMapping[targetComment.userId] ||
                        targetComment.display_name ||
                        '익명',
                };
                updateCommentInputMode();
            }
        });
    }

    // 업로드 버튼: 내용 비어있으면 막기 (폼 submit은 그대로 해서 백엔드로 보냄)
    if (submitBtn && commentInput) {
        submitBtn.addEventListener('click', (e) => {
            if (!commentInput.value.trim()) {
                e.preventDefault();
                console.warn('[anonymous] 댓글 입력이 비어 있습니다.');
            }
        });
    }
});
