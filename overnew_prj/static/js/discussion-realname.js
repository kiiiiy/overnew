// ----- 1. 가짜 데이터 (Dummy Data) -----
// (NEW) 대댓글(replies) 구조 포함
let dummyComments = [
    { 
        id: 'c1', user: '박춘봉', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=박', date: 'Aug 19, 2021', 
        text: 'AI가 수입식품 검사에 도입되면 정말 위험한 제품들을 더 빨리 걸러낼 수 있을까? 아직도 뭔가 불안한데 ...난 잘 모르겠다..', 
        likes: 5, replies: [
            { id: 'c3', user: '김철수', avatar: 'https://via.placeholder.com/30x30/CCCCCC/FFFFFF?text=김', date: 'Aug 19, 2021', text: '맞아요, 기사에서 읽었는데 심사 기간이 엄청 줄어들긴 했다던데, 혹시 놓치는 부분이 있지 않을지 걱정돼요.', likes: 0, replies: [] },
            { id: 'c4', user: '박춘봉', avatar: 'https://via.placeholder.com/30x30/CCCCCC/FFFFFF?text=박', date: 'Aug 19, 2021', text: 'AI 버전으로 문제가 생기는 시나리오가 더 있을까요?', likes: 1, replies: [] }
        ] 
    },
    { 
        id: 'c2', user: '김철수', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', date: 'Aug 18, 2021', 
        text: '이거 정말 필요한 기능이라고 생각합니다. 식품 안전이 중요하죠.', 
        likes: 12, replies: [] 
    }
];

// (NEW) 댓글 좋아요/답글 상태 관리
let likedComments = JSON.parse(localStorage.getItem('comment_likes')) || [];
let currentSortOrder = 'oldest'; // 'oldest' or 'newest'
let replyTarget = null; // { id: 'c1', user: '박춘봉' }

// ----- 2. HTML 생성 함수 -----
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);
    
    // 1. 대댓글 HTML 먼저 생성
    let repliesHTML = '';
    if (commentData.replies && commentData.replies.length > 0) {
        repliesHTML = commentData.replies.map(reply => createCommentHTML(reply)).join('');
    }

    // 2. 부모 댓글 HTML 생성
    return `
    <div class="comment-item ${commentData.replies.length > 0 ? 'has-replies' : ''}" data-comment-id="${commentData.id}">
        <img src="${commentData.avatar}" alt="${commentData.user}" class="comment-avatar">
        <div class="comment-content">
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
    
    // 1. 정렬
    dummyComments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentSortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    // 2. 렌더링
    commentContainer.innerHTML = dummyComments.map(comment => createCommentHTML(comment)).join('');
}

// (NEW) 댓글 입력창 상태 업데이트
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

    // 1. 로그인 확인 및 내 정보 표시
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }
    // (핵심) 하단 입력창에 내 프로필 표시
    document.getElementById('my-avatar').src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=나'; // (user-info에 avatar가 있다고 가정)
    
    // 2. 정렬 버튼 클릭
    sortBtn.addEventListener('click', () => {
        currentSortOrder = (currentSortOrder === 'oldest') ? 'newest' : 'oldest';
        sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
        renderComments(); // 정렬 후 다시 그리기
    });

    // 3. (핵심) 댓글 목록에서 '좋아요' 또는 '답글' 버튼 클릭 (이벤트 위임)
    commentList.addEventListener('click', (e) => {
        const targetCommentElement = e.target.closest('.comment-item');
        if (!targetCommentElement) return;
        
        const clickedCommentId = targetCommentElement.dataset.commentId;

        // 3-1. '좋아요' 버튼 클릭
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
                    targetComment.likes = Math.max(0, targetComment.likes - 1);
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

        // 3-2. '답글' 버튼 클릭
        if (e.target.closest('.reply-btn')) {
            // (핵심) 답글 달 대상(부모 댓글)을 저장
            const parentComment = dummyComments.find(c => c.id === clickedCommentId) || dummyComments.flatMap(c => c.replies).find(r => r.id === clickedCommentId);
            replyTarget = { id: clickedCommentId, user: parentComment.user };
            updateCommentInputMode(); // 입력창 placeholder 변경
        }
    });

    // 4. (핵심) '업로드' 버튼 클릭 (새 댓글 또는 답글 등록)
    submitBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText === '') return;

        const newComment = {
            id: 'c' + (Math.random() * 1000), // 임시 ID
            user: userInfo.nickname || '나', // (핵심) 내 실명
            avatar: userInfo.avatar || 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=나',
            date: new Date().toISOString().split('T')[0], // (임시) 오늘 날짜
            text: commentText,
            likes: 0,
            replies: []
        };

        if (replyTarget) {
            // [답글 등록]
            // 1. 부모 댓글 찾기 (1~2 depth)
            let parent = dummyComments.find(c => c.id === replyTarget.id);
            if (parent) {
                parent.replies.push(newComment);
            } else {
                dummyComments.forEach(c => {
                    let parentReply = c.replies.find(r => r.id === replyTarget.id);
                    if(parentReply) parentReply.replies.push(newComment); // (3 depth 이상)
                });
            }
            replyTarget = null; // 답글 모드 해제
        } else {
            // [새 댓글 등록]
            dummyComments.push(newComment);
        }

        commentInput.value = ''; // 입력창 비우기
        updateCommentInputMode(); // placeholder 원복
        renderComments(); // 새 댓글 포함해서 다시 그리기
    });

    // 5. 페이지 첫 로드
    renderComments();
});
