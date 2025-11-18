// ----- 1. Dummy Data -----
const dummyData = {
    similar: {
        politics: [
            { user: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', userId: 'kwon',
              articles: [
                { id: 'article-sataedong', image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', title: "'사태동 광물' 최대 변수…황금돼지띠 N수생, 경쟁 격...", source: '연합뉴스', reactions: '29' },
                { id: 'article-gookmin', noImage: true, title: "'미국의 관세-투자' 굴욕 협상에 생산 현장은 한숨 늘어나", source: '오마이뉴스 · 5시간전', reactions: null }
              ]
            }
        ],
        economy: [
            { user: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', userId: 'leftgabi',
              articles: [
                { id: 'article-lg', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "'신혼가전 대기' LG전자 대리점장 구속", source: 'SBS', reactions: '18' }
              ]
            },
            { user: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', userId: 'kimlinky',
              articles: [
                { id: 'article-tajo', noImage: true, title: "타조가 제일 싸... '이것도' 아껴 판다", source: '조선일보', reactions: null }
              ]
            }
        ],
        society: [], it: [], culture: [], world: []
    },
    opposite: {
        politics: [
            { user: '권또또', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=권', userId: 'kwon',
              articles: [
                { id: 'article-daraengi', image: 'https://via.placeholder.com/280x180/4A148C/FFFFFF?text=정치뉴스', title: "'다랭이' 10년 만에 2억 5000만번 달랬다...", source: '서울신문 · 7시간전', comments: '10+' }
              ]
            }
        ],
        economy: [
            { user: '왼가비', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=왼', userId: 'leftgabi',
              articles: [
                { id: 'article-seoul-subway', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "서울 지하철은 지금…'보쌈에 순대까지'", source: '서울경제 · 2시간전', comments: '30+' }
              ]
            },
            { user: '김링키', avatar: 'https://via.placeholder.com/36x36/CCCCCC/FFFFFF?text=김', userId: 'kimlinky',
              articles: [
                { id: 'article-market', image: 'https://via.placeholder.com/280x180/1B5E20/FFFFFF?text=경제뉴스', title: "'바가지 논란' 광장시장 상인 '유튜버'", source: '조선일보 · 12시간전', comments: '100+' }
              ]
            }
        ],
        society: [], it: [], culture: [], world: []
    }
};

// ----- 2. Following List (localStorage) -----
let followingList = JSON.parse(localStorage.getItem('following_list')) || [];

// ----- 3. HTML 생성 함수 -----
function createUserGroupHTML(groupData, view) {
    const isFollowed = followingList.includes(groupData.userId);

    let articlesHTML = '';
    groupData.articles.forEach(article => {
        let reactionsHTML = '';
        if (view === 'similar') {
            reactionsHTML = article.reactions ? `<span class="meta-count">${article.reactions}</span>` : '';
        } else {
            reactionsHTML = article.comments ? `<span class="meta-comments">💬 ${article.comments}</span>` : '';
        }

        const noImageClass = article.noImage ? 'no-image' : '';
        const imageHTML = article.noImage ? '' : `
            <a href="article-detail.html?id=${article.id}" class="card-image-link">
                <img src="${article.image || 'image-placeholder.jpg'}" alt="${article.title}" class="card-image">
            </a>`;

        articlesHTML += `
        <div class="user-article ${noImageClass}">
            ${imageHTML}
            <div class="card-content">
                <a href="article-detail.html?id=${article.id}" class="card-title-link">
                    <h3 class="card-title">${article.title}</h3>
                </a>
                <div class="card-meta">
                    <span class="card-source">${article.source}</span>
                    <span class="card-reactions">${reactionsHTML}</span>
                </div>
            </div>
        </div>
        `;
    });

    return `
    <div class="user-feed-group">
        <div class="user-feed-header">
            <a href="profile-detail.html?user=${groupData.userId}" class="user-profile-link">
                <img src="${groupData.avatar}" alt="${groupData.user}" class="card-avatar">
                <span class="card-username">${groupData.user}</span>
            </a>
            <button class="follow-btn ${isFollowed ? 'followed' : ''}" data-userid="${groupData.userId}">
                ${isFollowed ? '팔로잉' : '팔로우'}
            </button>
        </div>
        ${articlesHTML}
    </div>
    `;
}

// ----- 4. Feed 렌더링 -----
function renderFeed() {
    const currentView = document.getElementById('view-similar').checked ? 'similar' : 'opposite';
    const currentTopic = document.querySelector('.keyword-tag.active').dataset.topic;
    const feedContainer = document.getElementById(currentView === 'similar' ? 'feed-similar' : 'feed-opposite');

    const userGroups = (dummyData[currentView] && dummyData[currentView][currentTopic]) ? dummyData[currentView][currentTopic] : [];

    feedContainer.innerHTML = '';

    if (userGroups.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px;">이 주제의 추천이 없습니다.</p>';
        return;
    }

    let allGroupsHTML = '';
    userGroups.forEach(group => {
        allGroupsHTML += createUserGroupHTML(group, currentView);
    });
    feedContainer.innerHTML = allGroupsHTML;

    addFollowButtonListeners();
}

// ----- 5. Follow 버튼 이벤트 ----- 
function addFollowButtonListeners() {
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        if (button.listenerAdded) return;

        button.addEventListener('click', () => {
            const userIdToFollow = button.dataset.userid;
            const isCurrentlyFollowed = button.classList.contains('followed');

            if (isCurrentlyFollowed) {
                button.classList.remove('followed');
                button.textContent = '팔로우';
                followingList = followingList.filter(id => id !== userIdToFollow);
            } else {
                button.classList.add('followed');
                button.textContent = '팔로잉';
                if (!followingList.includes(userIdToFollow)) followingList.push(userIdToFollow);
            }

            localStorage.setItem('following_list', JSON.stringify(followingList));
            console.log('Updated Following List:', followingList);
        });
        button.listenerAdded = true;
    });
}

// ----- 6. 이벤트 리스너 설정 -----
document.addEventListener('DOMContentLoaded', () => {
    const viewToggles = document.querySelectorAll('input[name="view-type"]');
    const feedSimilar = document.getElementById('feed-similar');
    const feedOpposite = document.getElementById('feed-opposite');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (toggle.value === 'similar' && toggle.checked) {
                feedSimilar.style.display = 'block';
                feedOpposite.style.display = 'none';
            } else if (toggle.value === 'opposite' && toggle.checked) {
                feedSimilar.style.display = 'none';
                feedOpposite.style.display = 'block';
            }
            renderFeed();
        });
    });

    const keywordTags = document.querySelectorAll('.keyword-tag');
    keywordTags.forEach(tag => {
        tag.addEventListener('click', () => {
            keywordTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderFeed();
        });
    });

    renderFeed();
});
