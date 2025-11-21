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
<<<<<<< HEAD
        
        <!-- (핵심 추가) 프로필 클릭 가능 -->
        <img src="${commentData.avatar}" 
             alt="${commentData.user}" 
             class="comment-avatar comment-profile" 
             data-username="${commentData.user}">

        <div class="comment-content">
            <div class="comment-header">
                <!-- (핵심 추가) 이름도 클릭 가능 -->
                <span class="comment-user comment-profile" data-username="${commentData.user}">
                    ${commentData.user}
                </span>
                <span class="comment-date">${commentData.date}</span>
            </div>
            <p class="comment-text">${commentData.text}</p>

=======
        <img src="${commentData.avatar}" alt="${commentData.user}" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">${commentData.user}</span>
                <span class="comment-date">${commentData.date}</span>
            </div>
            <p class="comment-text">${commentData.text}</p>
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
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

<<<<<<< HEAD
    // 1. 로그인 확인
=======
    // 1. 로그인 확인 및 내 정보 표시
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }
<<<<<<< HEAD

    document.getElementById('my-avatar').src = userInfo.avatar || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=나';

    // 2. 정렬 버튼
    sortBtn.addEventListener('click', () => {
        currentSortOrder = (currentSortOrder === 'oldest') ? 'newest' : 'oldest';
        sortBtn.innerHTML = `<span>⇅</span> ${currentSortOrder === 'oldest' ? '오래된순' : '최신순'}`;
        renderComments();
    });

    // 3. 댓글 목록에서 클릭 이벤트 위임
    commentList.addEventListener('click', (e) => {
        const targetCommentElement = e.target.closest('.comment-item');
        const clickedCommentId = targetCommentElement?.dataset.commentId;

        // ----- (NEW) 프로필 클릭 → 상세 프로필 페이지 이동 -----
        const profileEl = e.target.closest('.comment-profile');
        if (profileEl) {
            const username = profileEl.dataset.username;
            window.location.href = `../../../archive/templates/archive/profile-detail.html?user=${username}`;
            return;
        }

        // ----- 좋아요 처리 -----
        if (e.target.closest('.like-btn')) {
            const likeButton = e.target.closest('.like-btn');

            let targetComment = dummyComments.find(c => c.id === clickedCommentId);
            if (!targetComment) {
=======
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
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
                for (let comment of dummyComments) {
                    targetComment = comment.replies.find(r => r.id === clickedCommentId);
                    if (targetComment) break;
                }
            }
<<<<<<< HEAD

            if (targetComment) {
                const isCurrentlyLiked = likedComments.includes(clickedCommentId);

                if (isCurrentlyLiked) {
=======
            
            if (targetComment) {
                const isCurrentlyLiked = likedComments.includes(clickedCommentId);
                
                if (isCurrentlyLiked) {
                    // 좋아요 취소
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
                    likeButton.classList.remove('active');
                    likedComments = likedComments.filter(id => id !== clickedCommentId);
                    targetComment.likes = Math.max(0, targetComment.likes - 1);
                } else {
<<<<<<< HEAD
=======
                    // 좋아요 추가
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
                    likeButton.classList.add('active');
                    likedComments.push(clickedCommentId);
                    targetComment.likes += 1;
                }
<<<<<<< HEAD

                likeButton.querySelector('.count').textContent = targetComment.likes;

=======
                
                // 숫자 업데이트
                const countSpan = likeButton.querySelector('.count');
                if (countSpan) {
                    countSpan.textContent = targetComment.likes;
                }
                
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
                localStorage.setItem('comment_likes', JSON.stringify(likedComments));
            }
        }

<<<<<<< HEAD
        // ----- 답글 클릭 -----
        if (e.target.closest('.reply-btn')) {
            const parentComment = 
                dummyComments.find(c => c.id === clickedCommentId) ||
                dummyComments.flatMap(c => c.replies).find(r => r.id === clickedCommentId);

            replyTarget = { id: clickedCommentId, user: parentComment.user };
            updateCommentInputMode();
        }
    });

    // 4. 댓글 제출
=======
        // 3-2. '답글' 버튼 클릭
        if (e.target.closest('.reply-btn')) {
            // (핵심) 답글 달 대상(부모 댓글)을 저장
            const parentComment = dummyComments.find(c => c.id === clickedCommentId) || dummyComments.flatMap(c => c.replies).find(r => r.id === clickedCommentId);
            replyTarget = { id: clickedCommentId, user: parentComment.user };
            updateCommentInputMode(); // 입력창 placeholder 변경
        }
    });

    // 4. (핵심) '업로드' 버튼 클릭 (새 댓글 또는 답글 등록)
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
    submitBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText === '') return;

        const newComment = {
<<<<<<< HEAD
            id: 'c' + (Math.random() * 10000).toFixed(0),
            user: userInfo.nickname || '나',
            avatar: userInfo.avatar,
            date: new Date().toISOString().split('T')[0],
=======
            id: 'c' + (Math.random() * 1000), // 임시 ID
            user: userInfo.nickname || '나', // (핵심) 내 실명
            avatar: userInfo.avatar || 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=나',
            date: new Date().toISOString().split('T')[0], // (임시) 오늘 날짜
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
            text: commentText,
            likes: 0,
            replies: []
        };

        if (replyTarget) {
<<<<<<< HEAD
=======
            // [답글 등록]
            // 1. 부모 댓글 찾기 (1~2 depth)
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
            let parent = dummyComments.find(c => c.id === replyTarget.id);
            if (parent) {
                parent.replies.push(newComment);
            } else {
                dummyComments.forEach(c => {
                    let parentReply = c.replies.find(r => r.id === replyTarget.id);
<<<<<<< HEAD
                    if (parentReply) parentReply.replies.push(newComment);
                });
            }
            replyTarget = null;
        } else {
            dummyComments.push(newComment);
        }

        commentInput.value = '';
        updateCommentInputMode();
        renderComments();
    });

    // 뒤로가기 버튼
    document.getElementById("back-button").addEventListener("click", function () {
        history.back();
    });
    
    // 첫 렌더링
    renderComments();
});

// ----- (A) 핀 고정 기능 관련 기존 코드 -----
document.addEventListener('DOMContentLoaded', () => {
    const pinBtn = document.getElementById('pin-btn');
    const pinnedBox = document.getElementById('pinned-discussion-box');
    const storageKey = 'pinned_discussions';
    const storageDataKey = 'pinned_discussions_data';
    let pinnedDiscussions = JSON.parse(localStorage.getItem(storageKey)) || [];
    let pinnedData = JSON.parse(localStorage.getItem(storageDataKey)) || {};

    const discussionId = new URLSearchParams(window.location.search).get('id') || 'discussion-1';
    const discussionTitle = document.querySelector('.article-title')?.textContent || '제목 없음';
    const discussionCategory = document.querySelector('.card-category')?.textContent || '카테고리 없음';
    const discussionSource = document.querySelector('.card-source')?.textContent || '출처 없음';

    if (pinBtn && pinnedDiscussions.includes(discussionId)) {
        pinBtn.classList.add('active');
        pinBtn.textContent = '📌 고정됨';
    }

    function renderPinnedBox() {
        if (pinnedBox) {
            if (pinnedDiscussions.includes(discussionId)) {
                pinnedBox.innerHTML = `<div class="pinned-item" style="cursor:pointer;" onclick="window.location.href='discussion-detail.html?id=${discussionId}'">
                    📌 ${discussionTitle}
                    <button class="unpin-btn" style="background-color: #6A1B9A; color: white; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 14px;">고정 삭제</button>
                </div>`;
                const unpinBtn = pinnedBox.querySelector('.unpin-btn');
                if (unpinBtn) {
                    unpinBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        pinnedDiscussions = pinnedDiscussions.filter(id => id !== discussionId);
                        delete pinnedData[discussionId];
                        localStorage.setItem(storageKey, JSON.stringify(pinnedDiscussions));
                        localStorage.setItem(storageDataKey, JSON.stringify(pinnedData));
                        if (pinBtn) {
                            pinBtn.classList.remove('active');
                            pinBtn.textContent = '📌 고정';
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
});

// ----- 2-2. 남은 시간 동적 업데이트 기능 -----
function calculateRemainingTime(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return '종료됨';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}시간 ${minutes}분 남음`;
    } else {
        return `${minutes}분 남음`;
    }
}

function updateDiscussionTimes() {
    const cards = document.querySelectorAll('.discussion-card');
    cards.forEach(card => {
        const timeElement = card.querySelector('.time-left');
        const endTime = card.dataset.endTime;
        if (timeElement && endTime) {
            timeElement.textContent = `🕒 ${calculateRemainingTime(endTime)}`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // 주기적으로 시간 업데이트
    setInterval(updateDiscussionTimes, 60000); // 1분마다 업데이트

    renderPinnedBox();
    renderComments();
    updateDiscussionTimes(); // 초기 호출
});
=======
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
>>>>>>> b2c985c2b2b3249d9e0e669bd4007e9398b0a982
