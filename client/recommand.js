const SERVER_URL = 'http://localhost:7003/api/chat';

const chatLog = document.getElementById('chat-log'); // 채팅 기록이 표시될 div 엘리먼트
const form = document.querySelector('.input-form'); // form 엘리먼트
const chatInput = document.querySelector('.chat-input'); // 메시지 입력 창 엘리먼트

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // userInput값 채팅 로그를 업데이트
    const userInput = chatInput.value; // 사용자가 입력한 값
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerHTML = `<p>${userInput}</p>`;
    chatLog.appendChild(userMessage);

    // 사용자가 입력한 값이 없으면 더 이상 실행하지 않음
    if (!userInput) {
        return;
    }

    // 사용자가 입력한 값을 서버로 전송하여 AI 응답을 가져옴
    const data = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
    }).then((res) => res.json());

    // 서버에서 가져온 응답을 기반으로 채팅 로그를 업데이트함
    const botMessage = document.createElement('div');
    botMessage.className = 'chat-message';
    botMessage.innerHTML = `
    <p>${data.output}</p>
  `;
    chatLog.appendChild(botMessage);

    // 메시지 입력 창을 초기화
    chatInput.value = '';
});
