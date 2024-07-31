const content = {
    'home': {
        title: '首页',
        content: '欢迎来到极客侠GeeksMan的网站！'
    },
    'stm32': {
        title: 'STM32 教程',
        subcategories: {
            '介绍': 'STM32单片机简介...',
            '快速开始': 'STM32开发环境搭建和基础知识...',
            '高级主题': {
                'GPIO操作': {
                    'LED流水灯': `
                    # LED流水灯实验
                    
                    本实验将展示如何使用STM32控制多个LED实现流水灯效果。

                    ## 硬件连接
                    - 将多个LED连接到GPIOA的PIN0-PIN7

                    ## 代码实现
                    \`\`\`c
                    #include "main.h"

                    void LED_Init(void) {
                        GPIO_InitTypeDef GPIO_InitStruct = {0};
                        
                        __HAL_RCC_GPIOA_CLK_ENABLE();
                        
                        GPIO_InitStruct.Pin = GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3
                                             |GPIO_PIN_4|GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_7;
                        GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
                        GPIO_InitStruct.Pull = GPIO_NOPULL;
                        GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
                        HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
                    }

                    void LED_Flow(void) {
                        for(int i = 0; i < 8; i++) {
                            HAL_GPIO_WritePin(GPIOA, 1 << i, GPIO_PIN_SET);
                            HAL_Delay(200);
                            HAL_GPIO_WritePin(GPIOA, 1 << i, GPIO_PIN_RESET);
                        }
                    }

                    int main(void) {
                        HAL_Init();
                        SystemClock_Config();
                        LED_Init();
                        
                        while (1) {
                            LED_Flow();
                        }
                    }
                    \`\`\`

                    ## 实验效果
                    运行上述代码后，您将看到连接的LED灯依次点亮，形成流水灯效果。
                    `,
                    '按键控制': 'STM32按键控制LED的示例...'
                },
                '定时器': 'STM32定时器的使用...',
                'UART通信': 'STM32 UART通信示例...'
            }
        }
    },
    'esp32': {
        title: 'ESP32 教程',
        content: 'ESP32教程内容正在编写中...'
    }
};

function updateSidebar(category) {
    const sidebar = document.getElementById('nav-list');
    sidebar.innerHTML = '';
    const sidebarTitle = document.getElementById('sidebar-title');
    
    if (content[category].subcategories) {
        sidebarTitle.textContent = content[category].title;
        for (let subcat in content[category].subcategories) {
            const li = document.createElement('li');
            if (typeof content[category].subcategories[subcat] === 'object') {
                li.innerHTML = `<span>${subcat}</span>`;
                const subul = document.createElement('ul');
                for (let topic in content[category].subcategories[subcat]) {
                    const subli = document.createElement('li');
                    subli.innerHTML = `<a href="#" data-category="${category}" data-subcategory="${subcat}" data-topic="${topic}">${topic}</a>`;
                    subul.appendChild(subli);
                }
                li.appendChild(subul);
            } else {
                li.innerHTML = `<a href="#" data-category="${category}" data-subcategory="${subcat}">${subcat}</a>`;
            }
            sidebar.appendChild(li);
        }
    } else {
        sidebarTitle.textContent = '目录';
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-category="${category}">${content[category].title}</a>`;
        sidebar.appendChild(li);
    }
}

function updateContent(category, subcategory, topic) {
    const contentDiv = document.getElementById('content');
    const breadcrumb = document.getElementById('breadcrumb');
    
    let htmlContent = '';
    let breadcrumbHTML = `<a href="#" data-category="home">首页</a>`;
    
    if (category && content[category]) {
        breadcrumbHTML += ` / <a href="#" data-category="${category}">${content[category].title}</a>`;
        if (subcategory && content[category].subcategories && content[category].subcategories[subcategory]) {
            breadcrumbHTML += ` / <a href="#" data-category="${category}" data-subcategory="${subcategory}">${subcategory}</a>`;
            if (topic && typeof content[category].subcategories[subcategory] === 'object' && content[category].subcategories[subcategory][topic]) {
                breadcrumbHTML += ` / ${topic}`;
                htmlContent = content[category].subcategories[subcategory][topic];
            } else {
                htmlContent = content[category].subcategories[subcategory];
            }
        } else {
            htmlContent = content[category].content;
        }
    } else {
        htmlContent = content.home.content;
    }
    
    breadcrumb.innerHTML = breadcrumbHTML;
    contentDiv.innerHTML = marked.parse(htmlContent);
    
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateSidebar('stm32');
    updateContent('home');

    document.querySelector('header nav').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const category = e.target.id;
            updateSidebar(category);
            updateContent(category);
        }
    });

    document.getElementById('nav-list').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const category = e.target.dataset.category;
            const subcategory = e.target.dataset.subcategory;
            const topic = e.target.dataset.topic;
            updateContent(category, subcategory, topic);
        }
    });

    document.getElementById('breadcrumb').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const category = e.target.dataset.category;
            const subcategory = e.target.dataset.subcategory;
            updateContent(category, subcategory);
        }
    });
});
