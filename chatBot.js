/* init */
function init(url, inactiveMessage, greetMessage) {
    let chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'
    chatContainer.setAttribute('style', 'position: fixed; bottom: 50px; right: 50px; width: 380px; height: 620px; z-index: 99')

    iframe = document.createElement('iframe')
    iframe.src = `https://master.dttig9r6d49oq.amplifyapp.com?url=${url}&inactiveMessage=${inactiveMessage}&greetMessage=${greetMessage}`
    iframe.name = 'trafftChatBotiFrame'
    iframe.height = '100%'
    iframe.width = '100%'
    iframe.scrolling = 'no'
    iframe.style.border = 'none'

    window.addEventListener('resize', function(event) {
        if (event.target.innerWidth < '768') {
        chatContainer.setAttribute('style', 'position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; z-index: 99')
        } else {
        chatContainer.setAttribute('style', 'position: fixed; bottom: 50px; right: 50px; width: 380px; height: 620px; z-index: 99')
        }
    }, true);
}

/* initialize chatBot */
function initChatBot(url, inactiveMessage, greetMessage) {
    window.onload = () => {
        init(url, inactiveMessage, greetMessage)
    }
}
