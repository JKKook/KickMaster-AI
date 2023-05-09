const BUILD_SERVER =
    'https://dwwyyi3n4rqi2eah7qkqhty2rq0zfnvr.lambda-url.ap-northeast-2.on.aws/api/chat';
// const SERVER_URL = 'http://localhost:7003/api/chat';

const chatLog = document.getElementById('chat-log'); // 채팅 기록이 표시될 div 엘리먼트
const form = document.querySelector('.input-form'); // form 엘리먼트
const chatInput = document.querySelector('.chat-input'); // 메시지 입력 창 엘리먼트

// HISTORY : server에 배열 형태로 req.body에 데이터 전달
let userMessages = [];
let gptMessages = [];

// string 형태로 request에 전달
let selectOption = [];

// select option save
const save = () => {
    const optionBirth = document.querySelector('#yearOfBirth').value;
    const optionLeague = document.querySelector('#league').value;
    const optionPosition = document.querySelector('#position').value;

    let sumOption =
        optionBirth +
        '\u00a0' +
        optionLeague +
        '\u00a0' +
        optionPosition +
        '\u00a0';

    selectOption.push(sumOption);
    console.log(selectOption);

    if (selectOption) {
        chatInput.value = `${sumOption}`;
    }
    modal.style.display = 'none';
};

// onClick 이벤트를 save 함수 호출로 지정
document.querySelector('.select-save-btn').addEventListener('click', () => {
    // 자동적으로 "보내기" 버튼이 눌려서 request 보낼 수 있도록
    save();
    handleSubmit();
    // form.submit();
});

const handleSubmit = async () => {
    showLoading();
    // userInput값 채팅 로그를 업데이트
    const userInput = chatInput.value; // 사용자가 입력한 값
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerHTML = `<p>${userInput}</p>`;
    chatLog.appendChild(userMessage);

    // ** Message history - user
    userMessages.push(userInput);

    // 메시지 입력 창을 초기화
    chatInput.value = '';

    // 사용자가 입력한 값이 없으면 더 이상 실행하지 않음
    if (!userInput) {
        return;
    }

    // 사용자가 입력한 값을 서버로 전송하여 AI 응답을 가져옴
    const response = await fetch(BUILD_SERVER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Message history 전달
            selectOption, // selectOption req.body 전달
            userMessages, // input창
            gptMessages, // output창
        }),
    });

    const responseData = await response.json();

    hideLoading();
    // ** response Message history - Gpt
    const chatGptOuput = responseData.output;
    gptMessages.push(chatGptOuput);

    // 서버에서 가져온 응답을 기반으로 채팅 로그를 업데이트함
    const botMessage = document.createElement('div');
    botMessage.className = 'chat-message';
    botMessage.innerHTML = `
     <p>${chatGptOuput} </p>`;

    const linkText = document.createElement('p');
    linkText.classList.add('chat-pay-text');
    linkText.innerHTML = `\n 링크를 눌러서 후원이 가능합니다 =>`;
    const link = document.createElement('a');
    link.classList.add('chat-pay-link');
    link.href = 'https://toss.me/codrlee';
    link.innerHTML = `마음 표현하기🧡`;

    linkText.appendChild(link);
    botMessage.appendChild(linkText);

    chatLog.appendChild(botMessage);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
});

// select option
const selectElement = document.querySelector('#yearOfBirth');
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 2000; i -= 1) {
    const optionElement = document.createElement('option');
    optionElement.value = i;
    optionElement.textContent = i;
    selectElement.appendChild(optionElement);
}

// modal
const modal = document.querySelector('.modal');
const modalBtn = document.querySelector('.modal-btn');
const closeContent = document.querySelector('.close');

// When the user clicks the button, open the modal
modalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    setTimeout(() => {
        document.querySelector('.modal-content').style.transform =
            'perspective(500px) rotateX(0deg) translateY(0)';
    }, 50);
});

closeContent.addEventListener('click', () => {
    modal.style.display = 'none';
});

// spinner
const loading = document.querySelector('#loading');

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}
