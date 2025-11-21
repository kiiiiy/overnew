// ----- 1. 더미 데이터 -----
let dummyComments = [
    { 
        id: 'c1', userId: 'user1', date: 'Aug 19, 2021', 
        text: 'AI가 수입식품 검사에 도입되면 정말 위험한 제품들을 더 빨리 걸러낼 수 있을까?', 
        likes: 5, replies: [
            { id: 'c3', userId: 'user2', date: 'Aug 19, 2021', text: '맞아요, 기사에서 읽었는데 심사 기간이 줄어들긴 했다던데...', likes: 0, replies: [] },
            { id: 'c4', userId: 'user1', date: 'Aug 19, 2021', text: 'AI 버전으로 문제가 생기는 시나리오가 더 있을까요?', likes: 1, replies: [] }
        ] 
    },
    { 
        id: 'c2', userId: 'user2', date: 'Aug 18, 2021', 
        text: '이거 정말 필요한 기능이라고 생각합니다. 식품 안전이 중요하죠.', 
        likes: 12, replies: [] 
    }
];

// ----- 2. 상태 변수 -----
let likedComments = JSON.parse(localStorage.getItem('comment_likes')) || [];
let currentSortOrder = 'oldest'; 
let replyTarget = null;

// ----- 3. 로그인 유저 정보 -----
const userInfo = JSON.parse(localStorage.getItem('user-info'));
if (!userInfo) {
    alert('로그인이 필요한 페이지입니다.');
    window.location.href = 'login.html';
}

// ----- 4. 익명 이름 매핑 -----
const userMapping = {
    'user1': '익명1',
    'user2': '익명2'
};

// 로그인 유저용 익명 이름
if (!userMapping[userInfo.id]) {
    userMapping[userInfo.id] = '익명' + (Object.keys(userMapping).length + 1);
}

// ----- 5. 댓글 HTML 생성 -----
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);
    const avatarHTML = `<div class="comment-avatar anonymous-placeholder"></div>`;

    let repliesHTML = '';
    if (commentData.replies && commentData.replies.length > 0) {
        repliesHTML = commentData.replies.map(reply => createCommentHTML(reply)).join('');
    }

    return `
    <div class="comment-item ${commentData.replies.length > 0 ? 'has-replies' : ''}" data-comment-id="${commentData.id}">
        ${avatarHTML}
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${userMapping[commentData.userId]}</span>
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
            <div class="reply-list">${repliesHTML}</div>
        </div>
    </div>`;
}

// ----- 6. 댓글 렌더링 -----
function renderComments() {
    const container = document.getElementById('comment-list');
    dummyComments.sort((a,b) => {
        const dateA = new Date(a.date), dateB = new Date(b.date);
        return currentSortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
    container.innerHTML = dummyComments.map(c => createCommentHTML(c)).join('');
}

// ----- 7. 입력창 placeholder 업데이트 -----
function updateCommentInputMode() {
    const input = document.getElementById('comment-input');
    if (replyTarget) {
        input.placeholder = `@${userMapping[replyTarget.userId]} 님에게 답글 남기기`;
        input.focus();
    } else {
        input.placeholder = 'Add a comment';
    }
}

// ----- 8. 이벤트 리스너 -----
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('my-avatar').src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';

    const commentList = document.getElementById('comment-list');
    const sortBtn = document.getElementById('sort-btn');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('submit-comment-btn');

    // 정렬
    sortBtn.addEventListener('click', () => {
        currentSortOrder = currentSortOrder === 'oldest' ? 'newest' : 'oldest';
        sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
        renderComments();
    });

    // 좋아요 / 답글 클릭
    commentList.addEventListener('click', (e) => {
        const commentEl = e.target.closest('.comment-item');
        if (!commentEl) return;
        const commentId = commentEl.dataset.commentId;

        function findCommentById(list, id) {
            for (let c of list) {
                if (c.id === id) return c;
                if (c.replies.length > 0) {
                    const found = findCommentById(c.replies, id);
                    if (found) return found;
                }
            }
            return null;
        }

        const targetComment = findCommentById(dummyComments, commentId);

        // 좋아요
        if (e.target.closest('.like-btn') && targetComment) {
            const likeBtn = e.target.closest('.like-btn');
            const isLiked = likedComments.includes(commentId);
            if (isLiked) {
                likeBtn.classList.remove('active');
                likedComments = likedComments.filter(id => id !== commentId);
                targetComment.likes = Math.max(0, targetComment.likes - 1);
            } else {
                likeBtn.classList.add('active');
                likedComments.push(commentId);
                targetComment.likes += 1;
            }
            likeBtn.querySelector('.count').textContent = targetComment.likes;
            localStorage.setItem('comment_likes', JSON.stringify(likedComments));
        }

        // 답글
        if (e.target.closest('.reply-btn') && targetComment) {
            replyTarget = { id: commentId, userId: targetComment.userId };
            updateCommentInputMode();
        }
    });

    // 댓글/답글 업로드
    submitBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (!text) return;

        const newComment = {
            id: 'c' + Date.now() + Math.floor(Math.random()*1000),
            userId: userInfo.id,
            avatar: null,
            ate: new Date().toISOString().split('T')[0], // (임시) 오늘 날짜
            text: text,
            likes: 0,
            replies: []
        };

        if (!userMapping[userInfo.id]) {
            userMapping[userInfo.id] = '익명' + (Object.keys(userMapping).length + 1);
        }

        function findCommentById(list, id) {
            for (let c of list) {
                if (c.id === id) return c;
                if (c.replies.length > 0) {
                    const found = findCommentById(c.replies, id);
                    if (found) return found;
                }
            }
            return null;
        }

        if (replyTarget) {
            const parent = findCommentById(dummyComments, replyTarget.id);
            if (parent) parent.replies.push(newComment);
            replyTarget = null;
        } else {
            dummyComments.push(newComment);
        }

        commentInput.value = '';
        updateCommentInputMode();
        renderComments();
    });
    document.getElementById("back-button").addEventListener("click", function () {
    history.back();
});
    // 첫 렌더링
    renderComments();
});
