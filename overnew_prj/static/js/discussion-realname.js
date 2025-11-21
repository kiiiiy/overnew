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
        pinBtn.textContent = '📌 고정됨';
    }

    function renderPinnedBox() {
        if (pinnedBox) {
            if (pinnedDiscussions.includes(discussionId)) {
                pinnedBox.innerHTML = `<div class="pinned-item">
                    📌 ${discussionTitle} 
                    <button class="unpin-btn" style="margin-left:8px;cursor:pointer;">❌ 고정 해제</button>
                </div>`;
                const unpinBtn = pinnedBox.querySelector('.unpin-btn');
                if (unpinBtn) {
                     unpinBtn.addEventListener('click', () => {
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

    // 뒤로가기 버튼
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.addEventListener("click", function () {
            history.back();
        });
    }
});

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

    // 1. 로그인 확인
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }

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
                for (let comment of dummyComments) {
                    targetComment = comment.replies.find(r => r.id === clickedCommentId);
                    if (targetComment) break;
                }
            }

            if (targetComment) {
                const isLiked = likedComments.includes(targetComment.id);
                if (isLiked) {
                    likedComments = likedComments.filter(id => id !== targetComment.id);
                    targetComment.likes--;
                } else {
                    likedComments.push(targetComment.id);
                    targetComment.likes++;
                }
                localStorage.setItem('comment_likes', JSON.stringify(likedComments));
                renderComments();
            }
            return;
        }

        // ----- 답글 버튼 클릭 -----
        if (e.target.closest('.reply-btn')) {
            const replyButton = e.target.closest('.reply-btn');
            const commentItem = replyButton.closest('.comment-item');
            const commentId = commentItem.dataset.commentId;

            // 대댓글 입력란이 열려있으면 닫기
            const openReplyInput = commentItem.querySelector('.reply-input');
            if (openReplyInput) {
                openReplyInput.remove();
                return;
            }

            // 새로 대댓글 입력란 생성
            const replyInputHTML = `
            <div class="reply-input" style="display:none; margin-top:8px;">
                <img src="${userInfo.avatar}" alt="내 프로필" class="comment-avatar" style="width:32px;height:32px;">
                <textarea class="reply-textarea" placeholder="답글을 입력하세요..." rows="1"></textarea>
                <div class="reply-actions" style="margin-top:4px;">
                    <button class="action-btn submit-reply-btn">답글 달기</button>
                    <button class="action-btn cancel-reply-btn">취소</button>
                </div>
            </div>
            `;
            commentItem.insertAdjacentHTML('beforeend', replyInputHTML);

            const replyInput = commentItem.querySelector('.reply-input');
            const textarea = replyInput.querySelector('.reply-textarea');
            const cancelReplyBtn = replyInput.querySelector('.cancel-reply-btn');

            // (NEW) 대댓글 입력란 토글 기능
            replyButton.classList.toggle('active');
            if (replyButton.classList.contains('active')) {
                replyButton.innerHTML = '답글 취소';
                replyInput.style.display = 'block';
                textarea.focus();
            } else {
                replyButton.innerHTML = '답글 달기';
                replyInput.style.display = 'none';
                textarea.value = '';
            }

            // (NEW) 대댓글 입력란에서 Enter 키로 전송
            textarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = textarea.value.trim();
                    if (text) {
                        // 대댓글 데이터 생성
                        const newReply = {
                            id: `c${Date.now()}`,
                            user: userInfo.name,
                            avatar: userInfo.avatar,
                            date: new Date().toISOString().slice(0, 10),
                            text: text,
                            likes: 0,
                            replies: []
                        };

                        // 부모 댓글 찾기
                        let parentComment = dummyComments.find(c => c.id === commentId);
                        if (!parentComment) {
                            for (let comment of dummyComments) {
                                parentComment = comment.replies.find(r => r.id === commentId);
                                if (parentComment) break;
                            }
                        }

                        if (parentComment) {
                            parentComment.replies.push(newReply);
                            localStorage.setItem('dummy_comments', JSON.stringify(dummyComments));
                            renderComments();
                        }
                    }
                }
            });

            // (NEW) 대댓글 입력란에서 취소 버튼 클릭 시 동작
            cancelReplyBtn.addEventListener('click', () => {
                replyButton.classList.remove('active');
                replyButton.innerHTML = '답글 달기';
                replyInput.remove();
            });

            return;
        }
    });

    const submitComment = (text) => {
        const newComment = {
            id: `c${Date.now()}`,
            user: userInfo.name,
            avatar: userInfo.avatar,
            date: new Date().toISOString().slice(0, 10),
            text: text,
            likes: 0,
            replies: []
        };

        dummyComments.push(newComment);
        localStorage.setItem('dummy_comments', JSON.stringify(dummyComments));
        renderComments();
    };

    // 4. 댓글 입력 후 엔터 키 또는 버튼 클릭 시 댓글 등록
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (text) {
                submitComment(text);
                commentInput.value = '';
            }
        }
    });

    submitBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            submitComment(text);
            commentInput.value = '';
        }
    });
});

// (NEW) 페이지 로드 시 더미 데이터로 댓글 초기화
document.addEventListener('DOMContentLoaded', () => {
    const storedComments = JSON.parse(localStorage.getItem('dummy_comments'));
    if (storedComments && storedComments.length > 0) {
        dummyComments = storedComments;
    }
    renderComments();
});