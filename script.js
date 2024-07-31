// 模拟文档数据
const docs = {
    'STM32基础': {
        '介绍': 'STM32单片机介绍内容...',
        '开发环境搭建': 'STM32开发环境搭建步骤...',
        'HAL库使用': 'HAL库的基本使用方法...'
    },
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
    '显示模块': {
        '数码管显示': `
            # 数码管显示实验

            本实验将介绍如何使用STM32控制数码管显示数字。

            ## 硬件连接
            - 将数码管的段选信号连接到GPIOA的PIN0-PIN7
            - 将数码管的位选信号连接到GPIOB的PIN0-PIN3

            ## 代码实现
            \`\`\`c
            #include "main.h"

            // 共阴极数码管段码表
            const uint8_t segmentCode[] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F};

            void SegmentDisplay_Init(void) {
                GPIO_InitTypeDef GPIO_InitStruct = {0};
                
                __HAL_RCC_GPIOA_CLK_ENABLE();
                __HAL_RCC_GPIOB_CLK_ENABLE();
                
                // 段选GPIO初始化
                GPIO_InitStruct.Pin = GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3
                                     |GPIO_PIN_4|GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_7;
                GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
                GPIO_InitStruct.Pull = GPIO_NOPULL;
                GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
                HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

                // 位选GPIO初始化
                GPIO_InitStruct.Pin = GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3;
                HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
            }

            void DisplayDigit(uint8_t digit, uint8_t position) {
                // 清除所有位选
                HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0|GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3, GPIO_PIN_SET);
                
                // 设置段选
                GPIOA->ODR = segmentCode[digit];
                
                // 设置位选
                HAL_GPIO_WritePin(GPIOB, 1 << position, GPIO_PIN_RESET);
            }

            int main(void) {
                HAL_Init();
                SystemClock_Config();
                SegmentDisplay_Init();
                
                uint32_t number = 1234;
                
                while (1) {
                    for(int i = 0; i < 4; i++) {
                        DisplayDigit(number % 10, i);
                        number /= 10;
                        HAL_Delay(5);
                    }
                    number = 1234;  // 重置显示数字
                }
            }
            \`\`\`

            ## 实验效果
            运行上述代码后，您将看到数码管显示数字1234。
        `,
        'LCD显示': 'STM32控制LCD显示的示例...'
    }
    // 可以继续添加更多模块...
};

function createNavItem(title, items) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    const span = document.createElement('span');
    span.textContent = title;
    li.appendChild(span);

    if (items) {
        const ul = document.createElement('ul');
        for (let subTitle in items) {
            const subLi = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = subTitle;
            a.onclick = (e) => {
                e.preventDefault();
                displayContent(title, subTitle);
            };
            subLi.appendChild(a);
            ul.appendChild(subLi);
        }
        li.appendChild(ul);

        span.onclick = () => li.classList.toggle('open');
    }

    return li;
}

function displayContent(module, topic) {
    const content = document.getElementById('content');
    const text = docs[module][topic];
    
    // 处理Markdown样式的内容
    const formattedText = marked.parse(text);

    content.innerHTML = `<h1>${topic}</h1>${formattedText}`;
    
    // 应用代码高亮
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

    // 更新目录
    updateTableOfContents();
}

function updateTableOfContents() {
    const toc = document.querySelector('#toc ul');
    toc.innerHTML = '';
    const headers = document.querySelectorAll('#content h1, #content h2, #content h3');
    headers.forEach(header => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = header.textContent;
        a.href = `#${header.id}`;
        li.appendChild(a);
        toc.appendChild(li);
    });
}

function init() {
    const navList = document.getElementById('nav-list');

    for (let module in docs) {
        navList.appendChild(createNavItem(module, docs[module]));
    }

    // 默认显示第一个模块的第一个主题
    const firstModule = Object.keys(docs)[0];
    const firstTopic = Object.keys(docs[firstModule])[0];
    displayContent(firstModule, firstTopic);
}

window.onload = init;
