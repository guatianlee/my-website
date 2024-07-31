// 模拟文档数据
const docs = {
    '介绍': '这是文档网站的介绍页面。',
    '快速开始': '这里是快速开始指南。',
    '高级主题': '这里包含一些高级主题的讨论。'
};

// 初始化页面
function init() {
    const navList = document.getElementById('nav-list');
    const content = document.getElementById('content');
    const searchInput = document.getElementById('search-input');

    // 生成导航菜单
    for (let title in docs) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = title;
        a.onclick = (e) => {
            e.preventDefault();
            content.innerHTML = `<h2>${title}</h2><p>${docs[title]}</p>`;
        };
        li.appendChild(a);
        navList.appendChild(li);
    }

    // 加载第一个文档
    const firstTitle = Object.keys(docs)[0];
    content.innerHTML = `<h2>${firstTitle}</h2><p>${docs[firstTitle]}</p>`;

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredDocs = Object.keys(docs).filter(title => 
            title.toLowerCase().includes(searchTerm) || 
            docs[title].toLowerCase().includes(searchTerm)
        );
        
        navList.innerHTML = '';
        filteredDocs.forEach(title => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = title;
            a.onclick = (e) => {
                e.preventDefault();
                content.innerHTML = `<h2>${title}</h2><p>${docs[title]}</p>`;
            };
            li.appendChild(a);
            navList.appendChild(li);
        });
    });
}

// 页面加载完成后初始化
window.onload = init;
