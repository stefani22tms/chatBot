function init() {
    const template = `
        <div id="chat-container">
            <button class='chat-btn'>
                <img src = "assets/img/chatbot-avatar.png" class = "icon" >
            </button>
        </div>
    `
    document.body.innerHTML += template
}

function initChatBot(url, inactiveMessage) {
    init()
}