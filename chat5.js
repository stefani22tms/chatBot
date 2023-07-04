function init() {
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'

    iframe = document.createElement('iframe')
    iframe.src = 'https://chatbot.dev.trafft.com/'
    iframe.name = 'myiFrame'
    iframe.height = '400px'
    iframe.width = '600px'
    
    chatContainer.appendChild(iframe)
    document.body.appendChild(chatContainer)
}

function initChatBot(url, inactiveMessage) {
    init()
}

