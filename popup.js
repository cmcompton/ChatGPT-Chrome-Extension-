document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    if (userInput) {
        addMessageToChat('user', userInput);
        document.getElementById('userInput').value = '';

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: 'ASK_QUESTION', question: userInput }, (response) => {
            if (chrome.runtime.lastError) {
                addMessageToChat('bot', 'Error: ' + chrome.runtime.lastError.message);
                return;
            }

            if (response.error) {
                addMessageToChat('bot', 'Error: ' + response.error);
            } else {
                addMessageToChat('bot', response.answer);
            }
        });
    }
}

function addMessageToChat(sender, message) {
    const chat = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

