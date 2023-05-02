const SERVER_URL = 'http://localhost:7003/api/chat';

const chatlogs = document.querySelector('.chatlogs');
const chatInput = document.querySelector('.chat-input');
const btnSend = document.querySelector('.btn-send');

btnSend.addEventListener('click', async () => {
    try {
        const userInput = chatInput.value.trim();
        if (!userInput) return;
        chatInput.value = '';
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userInput,
            }),
        });
        const { chatbotMessage } = await response.json();
        renderChatbotMessage(chatbotMessage);
    } catch (error) {
        console.error(error);
    }
});

function renderChatbotMessage(message) {
    const chatbotBox = document.createElement('div');
    chatbotBox.classList.add('chat', 'chat-left');

    const chatbotAvatar = document.createElement('div');
    chatbotAvatar.classList.add('chat-avatar');

    const chatbotImg = document.createElement('img');
    chatbotImg.src =
        'https://image.flaticon.com/icons/png/512/1144/1144768.png';
    chatbotImg.alt = 'bot-avatar';

    const chatbotMessage = document.createElement('div');
    chatbotMessage.classList.add('chat-message');

    const chatbotText = document.createElement('p');
    chatbotText.textContent = message;

    chatbotMessage.appendChild(chatbotText);
    chatbotAvatar.appendChild(chatbotImg);
    chatbotBox.appendChild(chatbotAvatar);
    chatbotBox.appendChild(chatbotMessage);
    chatlogs.appendChild(chatbotBox);
}
