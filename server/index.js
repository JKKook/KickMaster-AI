const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const cors = require('cors');
const { systemContent } = require('./model/System');
const { userContent } = require('./model/User');
const app = express();
const PORT = 7003;

require('dotenv').config();

// 노드 데이터를 리액트로 보내기 위한 세팅
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors 옵션 세팅
let corsOptions = {
    origin: 'https://football-agent-ai.pages.dev',
    credentials: true,
};
app.use(cors(corsOptions));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST method Routes
app.post('/api/chat', async (req, res) => {
    const { userMessages, gptMessages, selectOption } = req.body;
    console.log(userMessages);
    console.log(gptMessages);
    console.log(selectOption);
    console.log(req.body);

    // ChatGPT 가스라이팅
    let settingMessages = [
        { role: 'system', content: systemContent.settings }, // 시스템 역할 부여
        { role: 'user', content: systemContent.settings }, // 시스템 역할 부여를 위한 일종의 조치(가스라이팅)
        { role: 'assistant', content: systemContent.initial }, // response

        // selectOption 셋팅
        {
            role: 'user',
            content: `제가 궁금한 정보는 ${selectOption}에 해당하는 선수입니다. 추천 선수는 3명이상 알려주세요`,
        },
        {
            role: 'assistant',
            content: `선택 사항이 ${selectOption}인 것을 확인했습니다`,
        },
    ];

    while (userMessages.length != 0 || gptMessages.length != 0) {
        // SERVER에서 디비에 저장해서 파싱할 때마다 전달하면 됨!
        if (userMessages.length != 0) {
            // JSON 형태로 SettingMessages에 client에서 받아온 userInput 배열 history 순차적으로 추가
            settingMessages.push(
                JSON.parse(
                    '{"role" : "user", "content" : "' +
                        String(userMessages.shift().replace(/\n/g, '')) +
                        '"}',
                ),
            );
        }
        if (gptMessages.length != 0) {
            // JSON 형태로 SettingMessages에 client에서 받아온 gptResponse 배열 history 순차적으로 추가
            settingMessages.push(
                JSON.parse(
                    '{"role" : "assistant", "content" : "' +
                        String(gptMessages.shift().replace(/\n/g, '')) +
                        '"}',
                ),
            );
        }
    }

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: settingMessages,
        temperature: 1, // 창의적인 답변이 나올 수 있도록
        top_p: 0.8,
    });
    let response = completion.data.choices[0].message['content'];
    res.json({ output: response });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports.handler = serverless(app);
