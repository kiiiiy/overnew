<<<<<<< HEAD
// =========================================================================
// ******** 1. 댓글 시스템 정의 (DOMContentLoaded 외부) *********
// =========================================================================

// ----- 1-1. 더미 데이터 -----
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
=======
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
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
        text: '이거 정말 필요한 기능이라고 생각합니다. 식품 안전이 중요하죠.', 
        likes: 12, replies: [] 
    }
];

<<<<<<< HEAD
// ----- 1-2. 상태 변수 및 유저 정보 -----
=======
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
let likedComments = JSON.parse(localStorage.getItem('comment_likes')) || [];
let currentSortOrder = 'oldest'; 
let replyTarget = null;

<<<<<<< HEAD
// [수정] 로그인 유저 정보: 로컬스토리지에서 가져오거나, 없을 경우 임시 ID 부여
const userInfo = JSON.parse(localStorage.getItem('user-info')) || { 
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    avatar: null
};

// [수정] 익명 이름 매핑: 'guest' 유저도 포함하여 초기화
const userMapping = {
    'user1': '익명1',
    'user2': '익명2'
};
if (!userMapping[userInfo.id]) {
    userMapping[userInfo.id] = '익명' + (Object.keys(userMapping).length + 1);
}

// ----- 1-3. 댓글 HTML 생성 함수 (재귀) -----
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);
    const avatarHTML = `<div class="comment-avatar anonymous-placeholder"></div>`;
    
=======
// (NEW) 이 토론방에서 '나'의 익명 (임시)
let myAnonymousName = '익명' + (Math.floor(Math.random() * 100) + 3);

// ----- 2. HTML 생성 함수 -----
function createCommentHTML(commentData) {
    const isLiked = likedComments.includes(commentData.id);
    
    // (NEW) avatar가 null이면 회색 원, 아니면 img 태그
    const avatarHTML = commentData.avatar
        ? `<img src="${commentData.avatar}" alt="${commentData.user}" class="comment-avatar">`
        : `<div class="comment-avatar anonymous-placeholder"></div>`;

>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
    let repliesHTML = '';
    if (commentData.replies && commentData.replies.length > 0) {
        repliesHTML = commentData.replies.map(reply => createCommentHTML(reply)).join('');
    }

<<<<<<< HEAD
    return `<div class="comment-item ${commentData.replies && commentData.replies.length > 0 ? 'has-replies' : ''}" data-comment-id="${commentData.id}">
        ${avatarHTML}
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${userMapping[commentData.userId] || '알 수 없음'}</span>
=======
    return `
    <div class="comment-item ${commentData.replies.length > 0 ? 'has-replies' : ''}" data-comment-id="${commentData.id}">
        ${avatarHTML} <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${commentData.user}</span>
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
                <span class="comment-date">${commentData.date}</span>
            </div>
            <p class="comment-text">${commentData.text}</p>
            <div class="comment-actions">
                <button class="action-btn like-btn ${isLiked ? 'active' : ''}">
                    <span>👍</span> <span class="count">${commentData.likes}</span>
                </button>
                <button class="action-btn reply-btn">
<<<<<<< HEAD
                    <span>💬</span> <span class="count">${commentData.replies ? commentData.replies.length : 0}</span>
                </button>
            </div>
            <div class="reply-list">${repliesHTML}</div>
        </div>
    </div>`;
}

// ----- 1-4. 댓글 렌더링 함수 -----
function renderComments() {
    const container = document.getElementById('comment-list');
    if (!container) {
        console.error("ID가 'comment-list'인 요소를 찾을 수 없습니다.");
        return;
    }
    
    dummyComments.sort((a,b) => {
        const dateA = new Date(a.date), dateB = new Date(b.date);
        return currentSortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
    
    container.innerHTML = dummyComments.map(c => createCommentHTML(c)).join('');
}

// ----- 1-5. 입력창 상태 업데이트 함수 -----
function updateCommentInputMode() {
    const input = document.getElementById('comment-input');
    const cancelBtn = document.getElementById('cancel-reply-btn'); 
    
    if (input) {
        if (replyTarget) {
            input.placeholder = `@${userMapping[replyTarget.userId]} 님에게 답글 남기기`;
            input.focus();
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
        } else {
            input.placeholder = 'Add a comment';
            if (cancelBtn) cancelBtn.style.display = 'none';
        }
    }
}

// ----- 1-6. 댓글 찾기 헬퍼 함수 -----
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


// =========================================================================
// ******** 2. DOMContentLoaded 이벤트 리스너 (기존 코드 대체) *********
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- (A) 핀 고정 기능 관련 기존 코드 ---
    const pinBtn = document.getElementById('pin-btn');
    const pinnedBox = document.getElementById('pinned-discussion-box');

    const storageKey = 'pinned_discussions';
    const storageDataKey = 'pinned_discussions_data';
    let pinnedDiscussions = JSON.parse(localStorage.getItem(storageKey)) || [];
    let pinnedData = JSON.parse(localStorage.getItem(storageDataKey)) || {};

    const discussionId = new URLSearchParams(window.location.search).get('id') || 'discussion-1';
    
    // [수정] document.querySelector('.article-title') 등이 null일 경우를 대비해 기본값 설정
    const discussionTitle = document.querySelector('.article-title')?.textContent || '제목 없음';
    const discussionCategory = document.querySelector('.card-category')?.textContent || '카테고리 없음';
    const discussionSource = document.querySelector('.card-source')?.textContent || '출처 없음';

    if (pinBtn && pinnedDiscussions.includes(discussionId)) {
        pinBtn.classList.add('active');
        pinBtn.textContent = '📌 고정';
    }

    function renderPinnedBox() {
        if (pinnedBox) {
            if (pinnedDiscussions.includes(discussionId)) {
                pinnedBox.innerHTML = `<div class="pinned-item" style="cursor: pointer;" onclick="location.href='/discussion/detail?id=${discussionId}'">
                    📌 ${discussionTitle} 
                    <button class="unpin-btn" style="margin-left:8px;cursor:pointer;">❌ 고정 해제</button>
                </div>`;
                const unpinBtn = pinnedBox.querySelector('.unpin-btn');
                if (unpinBtn) {
                    unpinBtn.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent triggering the click on the pinned item
                        pinnedDiscussions = pinnedDiscussions.filter(id => id !== discussionId);
                        delete pinnedData[discussionId];
                        localStorage.setItem(storageKey, JSON.stringify(pinnedDiscussions));
                        localStorage.setItem(storageDataKey, JSON.stringify(pinnedData));
                        if (pinBtn) {
                            pinBtn.classList.remove('active');
                            pinBtn.textContent = '📌 고정됨';
                        }
                        renderPinnedBox();
                        alert('고정이 해제되었습니다.');
                    });
                }
            } else {
                pinnedBox.innerHTML = '';
            }
        }
    }

    renderPinnedBox();

    if (pinBtn) {
        pinBtn.addEventListener('click', () => {
            if (pinnedDiscussions.includes(discussionId)) {
                pinnedDiscussions = pinnedDiscussions.filter(id => id !== discussionId);
                delete pinnedData[discussionId];
                pinBtn.classList.remove('active');
                pinBtn.textContent = '📌 고정';
            } else {
                pinnedDiscussions.push(discussionId);
                pinnedData[discussionId] = {
                    id: discussionId,
                    title: discussionTitle,
                    category: discussionCategory,
                    source: discussionSource
                };
                pinBtn.classList.add('active');
                pinBtn.textContent = '📌 고정됨';
            }
            localStorage.setItem(storageKey, JSON.stringify(pinnedDiscussions));
            localStorage.setItem(storageDataKey, JSON.stringify(pinnedData));
            renderPinnedBox();
            alert('커뮤니티 상단에 고정되었습니다.');
        });
    }

    // 뒤로가기 버튼
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.addEventListener("click", function () {
            history.back();
        });
    }

    // --- (B) 댓글 기능 관련 수정된 코드 ---
    const myAvatar = document.getElementById('my-avatar');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const submitBtn = document.getElementById('submit-comment-btn');
    const sortBtn = document.getElementById('sort-btn');
    const cancelReplyBtn = document.getElementById('cancel-reply-btn');


    // [추가] 초기 아바타 설정
    if (myAvatar) {
        myAvatar.src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=👤';
    }

    // [수정] 초기 댓글 로딩 (가장 중요)
    renderComments();

    // 정렬 이벤트 리스너
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            currentSortOrder = currentSortOrder === 'oldest' ? 'newest' : 'oldest';
            sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
            renderComments();
        });
    }

    // 답글 취소 이벤트 리스너
    if (cancelReplyBtn) {
        cancelReplyBtn.addEventListener('click', () => {
            replyTarget = null;
            updateCommentInputMode();
        });
    }

    // 좋아요 / 답글 클릭 이벤트 리스너 (위임)
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            const commentEl = e.target.closest('.comment-item');
            if (!commentEl) return;
            const commentId = commentEl.dataset.commentId;
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
                
                const countSpan = likeBtn.querySelector('.count');
                if (countSpan) countSpan.textContent = targetComment.likes;

                localStorage.setItem('comment_likes', JSON.stringify(likedComments));
            }

            // 답글
            if (e.target.closest('.reply-btn') && targetComment) {
                replyTarget = { id: commentId, userId: targetComment.userId };
                updateCommentInputMode();
            }
        });
    }

    // 댓글/답글 업로드 이벤트 리스너
    if (submitBtn && commentInput) {
        submitBtn.addEventListener('click', () => {
            const text = commentInput.value.trim();
            if (!text) return;

            const now = new Date();
            const newComment = {
                id: 'c' + Date.now() + Math.floor(Math.random()*1000),
                userId: userInfo.id,
                date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(/,(\s*)/g, ', '),
                text: text,
                likes: 0,
                replies: []
            };

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
    }
});
=======
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
        window.location.href = 'login.html';
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
                    if(parentReply) parentReply.replies.push(newComment);
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
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
