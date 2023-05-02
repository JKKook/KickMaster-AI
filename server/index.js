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
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST method Routes
app.post('/api/chat', async (req, res) => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemContent.settings }, // 시스템 역할 부여
            { role: 'user', content: systemContent.settings }, // 시스템 역할 부여를 위한 일종의 조치(가스라이팅)
            { role: 'assistant', content: systemContent.initial }, // response
            { role: 'user', content: userContent }, // request_input
        ],
        temperature: 1, // 창의적인 답변이 나올 수 있도록
    });
    let response = completion.data.choices[0].message['content'];
    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
