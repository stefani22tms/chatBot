function init() {
    let chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    let chatBtn = document.createElement('button');
    chatBtn.className = 'chat-btn';

    let avatar = document.createElement('img')
    avatar.src = "https://cdn.statically.io/gh/stefani22tms/chatBot/master/chatbot-avatar.png"
    avatar.className = 'icon'

    chatBtn.appendChild(avatar)
    chatContainer.appendChild(chatBtn)
    document.body.appendChild(chatContainer)
}

function initChatBot(url, inactiveMessage) {
    init()
}

