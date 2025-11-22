// ----- 1. 가짜 데이터 (Dummy Data) -----
// (수정) user는 "익명N", avatar는 null (익명)
let dummyComments = [
    {
        id: 'c1', user: '익명1', avatar: null, date: 'Aug 19, 2021',
        text: 'AI가 수입식품 검사에 도입되면 정말 위험한 제품들을 더 빨리 걸러낼 수 있을까? 아직도 뭔가 불안한데 ...난 잘 모르겠다..',
        likes: 5, replies: [
            { id: 'c3', user: '익명2', avatar: null, date: 'Aug 19, 2021', text: '맞아요, 기사에서 읽었는데 심사 기간이 엄청 줄어들긴 했다던데, 혹시 놓치는 부분이 있지 않을지 걱정돼요.', likes: 0, replies: [] },
            { id: 'c4', user: '익명1', avatar: null, date: 'Aug 19, 2021', text: 'AI 버전으로 문제가 생기는 시나리오가 더 있을까요?', likes: 1, replies: [] }
        ]
    },
    {
        id: 'c2', user: '익명2', avatar: null, date: 'Aug 18, 2021',
        text: '이거 정말 필요한 기능이라고 생각합니다. 식품 안전이 중요하죠.',
        likes: 12, replies: []
    }
];

let likedComments = JSON.parse(localStorage.getItem('comment_likes')) || [];
let currentSortOrder = 'oldest';
let replyTarget = null;

// (NEW) 이 토론방에서 '나'의 익명 (임시)
let myAnonymousName = '익명' + (Math.floor(Math.random() * 100) + 3);

// ----- 2. HTML 생성 함수 -----
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);

    // (NEW) avatar가 null이면 회색 원, 아니면 img 태그
    const avatarHTML = commentData.avatar
        ? `<img src="${commentData.avatar}" alt="${commentData.user}" class="comment-avatar">`
        : `<div class="comment-avatar anonymous-placeholder"></div>`;

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

    // 1. 로그인 확인 및 '내 아바타' 표시
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'account/login/';
        return;
    }
    // (스크린샷대로) 하단 입력창에는 '내' 아바타 표시
    document.getElementById('my-avatar').src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';

    // 2. 정렬 버튼 클릭
    sortBtn.addEventListener('click', () => {
        currentSortOrder = (currentSortOrder === 'oldest') ? 'newest' : 'oldest';
        sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
        renderComments();
    });

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
