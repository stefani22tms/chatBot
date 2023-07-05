function init() {
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'

    iframe = document.createElement('iframe')
    iframe.src = 'https://chatbot.dev.trafft.com/'
    iframe.name = 'myiFrame'
    iframe.height = '100px'
    iframe.width = '100px'
    iframe.scrolling = 'no'
    iframe.style.border = 'none'

    chatContainer.appendChild(iframe)
    document.body.appendChild(chatContainer)
  }

function initChatBot(url, inactiveMessage) {
    window.onload = () => {
      init()
    }
}

