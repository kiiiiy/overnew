// =========================================================================
// 0. CSRF 쿠키 헬퍼
// =========================================================================
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


// =========================================================================
// 1. 전역 상태 (서버에서 내려준 INITIAL_COMMENTS 사용)
// =========================================================================

let commentTree = Array.isArray(window.INITIAL_COMMENTS) ? window.INITIAL_COMMENTS : [];

let currentSortOrder = 'newest';
let replyTarget = null;

// 로그인 유저 정보 (프론트 임시, 익명 닉네임용)
const userInfo = JSON.parse(localStorage.getItem('user-info')) || {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    avatar: null
};

// 익명 이름 매핑 (실제 userId는 user의 pk)
const userMapping = {};

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

    // 현재 유저도 매핑 (없으면) – 익명방이니까 그냥 하나 붙여둠
    if (!userMapping[userInfo.id]) {
        userMapping[userInfo.id] = `익명${Object.keys(userMapping).length + 1}`;
    }
}

buildUserMappingFromComments(commentTree);


// =========================================================================
// 2. 헬퍼 함수들
// =========================================================================

function createCommentHTML(commentData) {
    const avatarHTML = `<div class="comment-avatar anonymous-placeholder"></div>`;
    const displayName = userMapping[commentData.userId] || '알 수 없음';
    const isLiked = !!commentData.is_liked;   // 서버에서 내려준 내 좋아요 여부

    let repliesHTML = '';
    if (commentData.replies && commentData.replies.length > 0) {
        repliesHTML = commentData.replies.map(reply => createCommentHTML(reply)).join('');
    }

    return `
    <div class="comment-item ${commentData.replies.length > 0 ? 'has-replies' : ''}" data-comment-id="${commentData.id}">
        ${avatarHTML} <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${commentData.user}</span>
                <span class="comment-date">${commentData.date}</span>
            </div>
            <p class="comment-text">${commentData.text}</p>
            <div class="comment-actions">
                <button class="action-btn like-btn ${isLiked ? 'active' : ''}">
                    <span>👍</span> <span class="count">${commentData.likes}</span>
                </button>
                <button class="action-btn reply-btn">
                    <span>💬</span> <span class="count">${commentData.replies.length}</span>
                </button>
            </div>
            <div class="reply-list">
                ${repliesHTML}
            </div>
        </div>
    </div>
    `;
}

// ----- 3. 렌더링 함수 -----
function renderComments() {
    const commentContainer = document.getElementById('comment-list');

    dummyComments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentSortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    commentContainer.innerHTML = dummyComments.map(comment => createCommentHTML(comment)).join('');
}

// (기존) 댓글 입력창 상태 업데이트
function updateCommentInputMode() {
    const input = document.getElementById('comment-input');
    if (replyTarget) {
        input.placeholder = `@${replyTarget.user} 님에게 답글 남기기`;
        input.focus();
    } else {
        input.placeholder = 'Add a comment';
    }
}

// ----- 4. 이벤트 리스너 -----
document.addEventListener('DOMContentLoaded', () => {
    const commentList = document.getElementById('comment-list');
    const sortBtn = document.getElementById('sort-btn');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('submit-comment-btn');

    // 1. '내 아바타' 표시 (로그인 안 되어 있으면 guest 아이디/기본 아바타 사용)
    const storedUserInfo = JSON.parse(localStorage.getItem('user-info'));
    const effectiveUserInfo = storedUserInfo || userInfo;  // 전역 userInfo(guest_...) fallback

    const myAvatarEl = document.getElementById('my-avatar');
    if (myAvatarEl) {
        myAvatarEl.src =
            effectiveUserInfo.avatar
            || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';
    }

    // 2. 정렬 버튼 클릭
    sortBtn.addEventListener('click', () => {
        currentSortOrder = (currentSortOrder === 'oldest') ? 'newest' : 'oldest';
        sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
        renderComments();
    });

    // ... (나머지 기존 코드 그대로)


    // 3. '좋아요' 또는 '답글' 버튼 클릭
    commentList.addEventListener('click', (e) => {
        const targetCommentElement = e.target.closest('.comment-item');
        if (!targetCommentElement) return;
        const clickedCommentId = targetCommentElement.dataset.commentId;

        // 3-1. '좋아요'
        if (e.target.closest('.like-btn')) {
            const likeButton = e.target.closest('.like-btn');

            // 댓글 데이터 찾기 (메인 댓글 또는 답글에서)
            let targetComment = dummyComments.find(c => c.id === clickedCommentId);
            if (!targetComment) {
                // 답글에서 찾기
                for (let comment of dummyComments) {
                    targetComment = comment.replies.find(r => r.id === clickedCommentId);
                    if (targetComment) break;
                }
            }

            if (targetComment) {
                const isCurrentlyLiked = likedComments.includes(clickedCommentId);

                if (isCurrentlyLiked) {
                    // 좋아요 취소
                    likeButton.classList.remove('active');
                    likedComments = likedComments.filter(id => id !== clickedCommentId);
                    targetComment.likes = Math.max(0, targetComment.likes - 1); // 0 이하로 내려가지 않게
                } else {
                    // 좋아요 추가
                    likeButton.classList.add('active');
                    likedComments.push(clickedCommentId);
                    targetComment.likes += 1;
                }

                // 숫자 업데이트
                const countSpan = likeButton.querySelector('.count');
                if (countSpan) {
                    countSpan.textContent = targetComment.likes;
                }

                localStorage.setItem('comment_likes', JSON.stringify(likedComments));
            }
        }

        // 3-2. '답글'
        if (e.target.closest('.reply-btn')) {
            // (수정) 답글 대상 찾기 (익명 이름)
            const parentComment = dummyComments.find(c => c.id === clickedCommentId) || dummyComments.flatMap(c => c.replies).find(r => r.id === clickedCommentId);
            replyTarget = { id: clickedCommentId, user: parentComment.user }; // user: '익명1'
            updateCommentInputMode();
        }
    });

    // 4. '업로드' 버튼 클릭
    submitBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText === '') return;

        // (수정) '익명'으로 새 댓글/답글 생성
        const newComment = {
            id: 'c' + (Math.random() * 1000),
            user: myAnonymousName, // (수정) '내' 익명
            avatar: null, // (수정) 익명 아바타
            date: new Date().toISOString().split('T')[0],
            text: commentText,
            likes: 0,
            replies: []
        };

        if (replyTarget) {
            // [답글 등록]
            let parent = dummyComments.find(c => c.id === replyTarget.id);
            if (parent) {
                parent.replies.push(newComment);
            } else {
                dummyComments.forEach(c => {
                    let parentReply = c.replies.find(r => r.id === replyTarget.id);
                    if (parentReply) parentReply.replies.push(newComment);
                });
            }
            replyTarget = null;
        } else {
            // [새 댓글 등록]
            dummyComments.push(newComment);
        }

        commentInput.value = '';
        updateCommentInputMode();
        renderComments();
    });

    // 5. 페이지 첫 로드
    renderComments();
});
