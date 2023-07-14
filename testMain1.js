const host = 'http://localhost:5005/webhooks/rest/webhook'
let tenantUrl = ''
let inactiveMessage = ''
let greetMessage = ''
let settings = []
let currencySimbol = ''
let chatBot = {}
let limit = 10

/* init */
function init() {
    // let chatContainer = document.createElement('div')
    // chatContainer.id = 'chat-container'

    // iframe = document.createElement('iframe')
    // iframe.src = 'https://chatbot.dev.trafft.com/'
    // iframe.name = 'myiFrame'
    // iframe.height = '200px'
    // iframe.width = '200px'
    // iframe.scrolling = 'no'
    // iframe.style.border = 'none'

    // chatContainer.appendChild(iframe)
    // document.body.appendChild(chatContainer)

    /* tenant settings */
    ajaxCall(tenantUrl + 'api/v1/public/settings', 'GET', setTenantSettings)
    getChatBotSettings()
    setChatBotBtn()
    showGreetPopupMsg()

    chatBtn = document.querySelector('.chat-btn')
    closeBtn = document.querySelector(".chat-btn-close")
    sendBtn = document.querySelector('.chat-btn-send')

    chatPopup = document.querySelector('.chat-popup')
    userMessageInput = document.querySelector('#chat-popup-user-message')
    chatArea = document.querySelector('.chat-popup__main')
    chatFooter = document.querySelector('.chat-popup__footer')
    chatHeaderAvatar = document.querySelector('.chat-popup__header__chat-info__avatar')
    chatHeaderName = document.querySelector('.chat-popup__header__chat-info__info__name')
    
    /* open chat popup */
    chatBtn.addEventListener('click', function() {
        this.classList.toggle('active')
        chatPopup.classList.toggle('active')
        setInitial()
    })

    /* close chat popup */
    closeBtn.addEventListener('click', function() {
      chatPopup.classList.toggle('active')
      chatBtn.classList.toggle('active')
      chatArea.innerHTML = ''
    })

    /* send user response */
    sendBtn.addEventListener('click', function() {
      sendUserResponse({
        "message": userMessageInput.value,
        "sender": "User",
        "metadata": {
          "tenant": tenantUrl
        }
      })
    })

    userMessageInput.addEventListener('keyup', function(event) {
      if (this.value.trim() != '') {
        document.documentElement.style.setProperty('--send', chatBot.accentColor)
      } else {
        document.documentElement.style.setProperty('--send', '#868E96')
      }

      if (event.key == 'Enter' && this.value.trim() != '') {
        sendUserResponse({
          "message": userMessageInput.value,
          "sender": "User",
          "metadata": {
            "tenant": tenantUrl
          }
        })
      }
    })

    
    document.addEventListener("click", function(e){
      const target = e.target;
      msg = null
    
      /* choose service/location */
      if(target.classList.contains('chat-btn-book')){
        if (target.dataset.service) {
          msg = target.dataset.service
        }
        if (target.dataset.location) {
          msg = target.dataset.location
        }
        if (target.dataset.employee) {
          msg = target.dataset.employee
        }
      }

      /* choose date */
      if (target.classList.contains('date-slot')) {
        let el = [...document.querySelectorAll('.active-btn')];
        if (el.length && (target.classList.contains('chat-popup__main__bot-response__date-slot__slot'))) {
          return;
        }
        setActiveButton(target)
        msg = target.dataset.date
      }

      /* choose time */
      if (target.classList.contains('time-slot')) {
        if (target.classList.contains('.active-btn') && (target.classList.contains('chat-popup__main__bot-response__time-slot__slot'))) {
          return;
        }
        setActiveButton(target)
        msg = target.dataset.time
      }

      if (msg) {
        data = {
          "message": msg,
          "sender": "User",
          "metadata": {
            "tenant": tenantUrl
          }
        }
        sendUserResponse(data)
      }
    });
}

function showGreetPopupMsg () {
  setTimeout(() => {
   let msg =  document.querySelector('.chat-greet-msg')
   msg.innerHTML = greetMessage
   msg.style.opacity = 1
  }, 2500)  
}

/* ajax */
function ajaxCall(url, method, action, data = null) {
  try {
    let xhttp = new XMLHttpRequest(); 
    xhttp.open(method, url, false);
  
    if (data) {
      xhttp.setRequestHeader("Content-Type", "application/json");
    }
  
    xhttp.onreadystatechange = function () {
      action(this.response)
    }
  
    xhttp.send(data);
  }
  catch (e) {
    console.log(e)
    printInactiveMessage()
    return null
  }
}

function setActiveButton (target) {
  target.classList.remove('dark-btn')
  target.classList.toggle('active-btn')
}

/* set initial things */
function setInitial () {
  chatHeaderName.innerHTML = chatBot.name
  limit = chatBot.slotLimit

  let url = 'assets/img/bot-icon.png'
  if (chatBot.avatar == '') {
    url = `${tenantUrl}api/v1/public/customize/chat-bot/avatar`
  }
  if (chatBot.avatar != 'null' && chatBot.avatar != '') {
    url = tenantUrl + `api/v1/public/media/${chatBot.avatar}?size=small`
  }
  chatHeaderAvatar.style.backgroundImage=`url('${url}')`; 
  document.documentElement.style.setProperty('--button-background', chatBot.accentColor)
  
  setFont()
  setDarkTheme()
  sendGreetMessage()
}

/* show greet message */
function sendGreetMessage() {
  setTimeout(() => {
    chatArea.innerHTML += `
      <div class="chat-popup__main__bot-response">
        <div class="chat-popup__main__bot-response__bot">
          <div class='chat-popup__main__bot-response__bot__avatar'></div>
          <span class="chat-popup__main__bot-response__bot__name" style='color: ${chatBot.theme == 'dark' ? 'white' : ''}'>${chatBot.name}</span>
        </div>
        <span class='chat-popup__main__bot-response__msg ${chatBot.theme == 'dark' ? 'dark' : ''}'> 
          ${greetMessage}
        </span>
      </div>`

      setBotAvatarImage()
      userMessageInput.focus()
  }, 1500)
}

function setBotAvatarImage() {
  let url = 'assets/img/bot-icon.png';
  if (chatBot.avatar == '') {
    url = `${tenantUrl}api/v1/public/customize/chat-bot/avatar`
  }
  if (chatBot.avatar != 'null' && chatBot.avatar != '') {
    url = tenantUrl + `api/v1/public/media/${chatBot.avatar}?size=small`
  }
 // let url = tenantUrl + `api/v1/public/media/${chatBot.avatar}?size=small`
  let responses = [...document.querySelectorAll('.chat-popup__main__bot-response__bot__avatar')]
  responses[responses.length-1].style.backgroundImage=`url('${url}')`; 
}

/* set dark theme */
function setDarkTheme() {
  if (chatBot.theme == 'dark') {
    chatArea.style.background = '#212529'
    chatFooter.style.background = '#343A40'
    userMessageInput.style.background = '#343A40'
    userMessageInput.style.color = 'white'
    document.documentElement.style.setProperty('--scrollbar', '#343A40')
  }
}

function setFont() {
  let customize = ''
  for (let setting of settings) {
    if (setting.name == 'customizeTheme') {
      customize = setting.value
    }
  }

  if (customize.font) {
    document.documentElement.style.setProperty('--font', customize.font)
  }
}

/* set tenant settings */
function setTenantSettings (data) {
  try {
    settings = JSON.parse(data).settings
  }
  catch (e) {
    return null
  }
}

/* get chatBotSettings */
function getChatBotSettings() {
  for (let setting of settings) {
    if (setting.name == "chatBotSettings") {
      chatBot = setting.value
    }
  }
}

/* set chat bot btn */
function setChatBotBtn() {
  let url = 'assets/img/bot-icon.png'
  if (chatBot.avatar == '') {
    url = `${tenantUrl}api/v1/public/customize/chat-bot/avatar`
  }
  if (chatBot.avatar != 'null' && chatBot.avatar != '') {
    url = tenantUrl + `api/v1/public/media/${chatBot.avatar}?size=small`
  }

  document.querySelector('.chat-btn').style.backgroundImage=`url('${url}')`; 
}

/* send response */
function sendUserResponse (data) {
  printUserResponse(data.message)
  sendBtn.src = 'https://cdn.statically.io/gh/stefani22tms/chatBot/master/plane.svg'
  userMessageInput.value = ''

  userMessageInput.blur()
  document.documentElement.style.setProperty('--send', '#868E96')
  showLoader()
  setBotAvatarImage()
  setTimeout(() => {
    ajaxCall(host, 'POST', printBotResponse, JSON.stringify(data))
    userMessageInput.focus()
  }, '1500')

}

/* print responses */
function printUserResponse(message) {
  // <div class="chat-popup__main__user-response__user">
  //     <img class='chat-popup__main__user-response__user__img' src ='https://cdn.statically.io/gh/stefani22tms/chatBot/master/chatbot-avatar.png' />
  //   </div>
  let template = `
  <div class="chat-popup__main__user-response">
    
    <span class='chat-popup__main__user-response__msg' style='background: ${chatBot.accentColor}'> 
      ${message}
    </span>
  </div>
  `
  chatArea.innerHTML += template
}

function showLoader () {
  chatArea.innerHTML += `<div class="chat-popup__main__bot-response">
      <div class="chat-popup__main__bot-response__bot">
        <div class='chat-popup__main__bot-response__bot__avatar'></div>
        <span class="chat-popup__main__bot-response__bot__name" style='color: ${chatBot.theme == 'dark' ? 'white' : ''}'>${chatBot.name}</span>
      </div>
      <div class="response-load">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    </div>`
}

function printBotResponse(response) {
  try {
    data = JSON.parse(response)
    let loader = document.querySelector('.response-load');
    loader.remove()

    let botResponse = [...document.querySelectorAll('.chat-popup__main__bot-response')]
    let template = `
      <span class='chat-popup__main__bot-response__msg ${chatBot.theme == 'dark' ? 'dark' : ''}'> 
        ${data[0].text}
      </span>
    `
    botResponse[botResponse.length - 1].innerHTML += template

    if (data[0].buttons) {
      if (chatBot.showInfo == 'btn') {
        printButtons(data[0].buttons)
      } else {
        printText(data[0].buttons)
      }
    }

  } catch(e) {
    console.log(e)
    printInactiveMessage()
    return null
  }
}

/* show iniactive message */
function printInactiveMessage() {
  let loader = document.querySelector('.response-load')
  if (loader) {
    loader.remove()
  }
  
  let botResponse = [...document.querySelectorAll('.chat-popup__main__bot-response')];
  let template = `
    <span class='chat-popup__main__bot-response__msg ${chatBot.theme == 'dark'? 'dark' : ''}'> 
      ${inactiveMessage}
    </span>
    `

    if (botResponse.length > 1) {
      botResponse[botResponse.length-1].innerHTML += template
      return;
    }

    botResponse.innerHTML += template
  
}

/* show list as buttons */
function printButtons (buttons) {
  let template = ''
  buttons.forEach((button, index) => {
    if (button.type == 'service') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__block">`
      }
      
      template += printServiceButtons(button.payload)
    }

    if (button.type == 'date') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__date-slot">`
      }

      if (index < limit) {
        template += printDateButtons(button.payload)
      }
      
    }

    if (button.type == 'time') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__time-slot">`
      }

      if (index < limit) {
        template += printTimeButtons(button.payload, button.duration)
      }
    }

    if (button.type == 'location') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__block">`
      }
      template += printLocationButtons(button.payload)
    }

    if (button.type == 'employee') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__block">`
      }
      template += printEmployeeButtons(button.payload)
    }
  })
  template += `</div>`

  chatArea.innerHTML += template
}

function printServiceButtons(service) {
  return `
    <div class='chat-popup__main__bot-response__block__btn ${chatBot.theme == 'dark'? 'dark' : ''}'> 
      <div  class='chat-popup__main__bot-response__block__btn__info'>
        <p class='chat-popup__main__bot-response__block__btn__info__name ${chatBot.theme == 'dark'? 'dark' : ''}'>
          ${service['name']}
        </p>

        <div class='chat-popup__main__bot-response__block__btn__info__other'>
          <div>
            <p class='chat-popup__main__bot-response__block__btn__info__other__img price'></p>
            <p>${getCurrency() + service['price']}</p>
          </div>
          <div>
            <p class='chat-popup__main__bot-response__block__btn__info__other__img duration'></p>
            <p>${formatDuration(service['duration'])}</p>
          </div>
        </div>
      </div>
      <div class='chat-popup__main__bot-response__block__btn__action'>
        <a href='#' data-service='${service['name']}' class="chat-btn-book">Choose</a>
      </div>
    </div>`
}

function printDateButtons(date) {
  return `
    <div class="chat-popup__main__bot-response__date-slot__slot date-slot ${chatBot.theme == 'dark' ? 'dark-btn' : ''}" data-date="${date}">
      ${date}
    </div>`
}

function printTimeButtons(time, duration) {
  return `
    <div class="chat-popup__main__bot-response__time-slot__slot time-slot ${chatBot.theme == 'dark' ? 'dark-btn' : ''}" data-time="${time}">
      ${formatTime(time, duration)}
    </div>`
}

function printLocationButtons (location) {
  let template =  `
    <div class='chat-popup__main__bot-response__block__btn ${chatBot.theme == 'dark'? 'dark' : ''}'> 
      <div  class='chat-popup__main__bot-response__block__btn__info'>
        <p class='chat-popup__main__bot-response__block__btn__info__name ${chatBot.theme == 'dark'? 'dark' : ''}'>
          ${location.name}
        </p>`
        if (location.address) {
          template += `<div class='chat-popup__main__bot-response__block__btn__info__other'>
          <div>
            <p class='chat-popup__main__bot-response__block__btn__info__other__img location'></p>
            <p>${location.address}</p>
          </div>

        </div>`
        }
        
    template += `</div>
     <div class='chat-popup__main__bot-response__block__btn__action'>
        <a href='#' data-location='${location.name}' class="chat-btn-book">Choose</a>
      </div>
    </div>`

    return template
}

function printEmployeeButtons (employee) {
  return  `
      <div class='chat-popup__main__bot-response__block__btn ${chatBot.theme == 'dark'? 'dark' : ''}'> 
        <div  class='chat-popup__main__bot-response__block__btn__info'>
          <p class='chat-popup__main__bot-response__block__btn__info__name ${chatBot.theme == 'dark'? 'dark' : ''}'>
            ${employee.firstName} ${employee.lastName}
          </p>
        </div>
      <div class='chat-popup__main__bot-response__block__btn__action'>
          <a href='#' data-employee='${employee.firstName} ${employee.lastName}' class="chat-btn-book">Choose</a>
        </div>
      </div>`
}

/* show list as text */
function printText(data) {
  let msgBlocks = [...document.querySelectorAll('.chat-popup__main__bot-response__msg')]
  let area = msgBlocks[msgBlocks.length-1]

  tags = `<span class='chat-popup__main__bot-response__msg__text'>`
  data.forEach((index, item) => {
    let string = ''
    if (item.type == 'service') {
      string = item.payload.name
    }

    if (item.type == 'date') {
      string = item.payload
    }

    if (item.type == 'time') {
      string = formatTime(item.payload, item.duration)
    }

    if (item.type == 'location') {
      string = item.payload.name
      if (item.payload.address) {
        string += `, ${item.payload.address}`
      }
    }

    if (item.type == 'employee') {
      string = `${item.payload.firstName} ${item.payload.lastName}`
    }

    tags += `<span class='chat-popup__main__bot-response__msg__text__tag ${chatBot.theme == 'dark' ? 'tag-dark' : ''}'> 
              ${string}
            </span>`
  });

  tags += `</span>`
  area.innerHTML += tags
}

/* get currency */
function getCurrency() {
  for (let setting of settings) {
    if (setting.name == "currencySymbol") {
      return setting.value
    }
  }
}

function formatDuration (seconds) {
    hours = Math.floor(seconds / 3600)
    minutes = seconds / 60 % 60
    duration = ''

    if (hours) {
      duration += hours + 'h'
    }
        
    if (hours && minutes) {
      duration += ' '
    }
        
    if (minutes){
      duration += minutes + 'min'
    }

    return duration
}

function formatTime (time, duration) {
  let [timeSlot, format] = time.split(' ')
  let [hours, minutes] = timeSlot.split(':'); 
  let date = new Date();
  date.setHours(hours, minutes, date.getSeconds() + duration);
  let newTime = date.toTimeString().slice(0, 5);
  if (format) {
    newTime += format
  }

  return `${time} - ${newTime}`
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
