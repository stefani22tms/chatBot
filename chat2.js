function init() {
    const template = `
        <div id="chat-container">
            <button class='chat-btn'>
            X
            </button>
        </div>
    `
    document.body.innerHTML += template
}

function initChatBot(url, inactiveMessage) {
    init()
}

/* <img src = "assets/img/chatbot-avatar.png" class = "icon" > */
