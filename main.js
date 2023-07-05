function init() {
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'

    iframe = document.createElement('iframe')
    iframe.src = 'https://chatbot.dev.trafft.com/'
    iframe.name = 'myiFrame'
    iframe.height = '200px'
    iframe.width = '200px'
    iframe.scrolling = 'no'
    iframe.style.border = 'none'

    chatContainer.appendChild(iframe)
    document.body.appendChild(chatContainer)

    chatBtn = document.querySelector('.chat-btn')
    closeBtn = document.querySelector(".chat-btn-close")

    chatPopup = document.querySelector('.chat-popup')
    userMessageInput = document.querySelector('#chat-popup-user-message')
    
    chatBtn.addEventListener('click', function() {
        this.classList.toggle('active')
        chatPopup.classList.toggle('active')
        userMessageInput.focus()
    })

    closeBtn.addEventListener('click', function() {
      chatPopup.classList.toggle('active')
      chatBtn.classList.toggle('active')
    })
  }

function initChatBot(url, inactiveMessage) {
    window.onload = () => {
      init()
    }
}
