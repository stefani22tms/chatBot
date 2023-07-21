

/* init */
function init() {
    console.log('init')
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'
    chatContainer.setAttribute('style', 'position: fixed;bottom: 0; right: 0; z-index: 99')

    iframe = document.createElement('iframe')
    iframe.src = 'https://master.dttig9r6d49oq.amplifyapp.com/'
    iframe.name = 'trafftChatBotiFrame'
    iframe.height = '100%'
    iframe.width = '100%'
    iframe.scrolling = 'no'
    iframe.style.border = 'none'
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')

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

