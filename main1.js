function init() {
      let chatContainer = document.createElement('div')
      chatContainer.id = 'chat-container'

      iframe = document.createElement('iframe')
      iframe.src = 'https://chatbot.dev.trafft.com/'
      iframe.name = 'myiFrame'
      iframe.height = '100px'
      iframe.width = '100px'

      chatContainer.appendChild(iframe)
      document.body.appendChild(chatContainer)
    }

    function initChatBot(url, inactiveMessage) {
      window.onload = () => {
        init()
      }
    }

    initChatBot(
      url = 'https://salonnailsalon.admin.dev.trafft.com',
      inactiveMessage = 'Server is down, Please contact the developer to activate it'
    )
