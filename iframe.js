

/* init */
function init() {
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'
    chatContainer.setAttribute('style', 'position: fixed; bottom: 0; right: 50px; width: 380px; height: 670px; z-index: 99')
    iframe = document.createElement('iframe')
    iframe.src = 'https://master.dttig9r6d49oq.amplifyapp.com/'
    iframe.name = 'trafftChatBotiFrame'
    iframe.height = '100%'
    iframe.width = '100%'
    iframe.scrolling = 'no'
    iframe.style.border = 'none'

    chatContainer.appendChild(iframe)
    document.body.appendChild(chatContainer)
}


/* initialize chatBot */
function initChatBot(url, inactiveMessage, greetMessage) {
    window.onload = () => {
      tenantUrl = url
      inactiveMessage = inactiveMessage
      greetMessage = greetMessage
      init()
    }
}

