let tenantUrl = ''
let inactiveMessage = ''
let greetMessage = ''
let settings = []
let chatBot = {
  'slotLimit': 8,
  'showInfo': 'btn',
  'name': 'Traffty', 
  'accentColor': '#32a852',
  'avatar:': "null"
}
let limit = 10
let selectedLocation = false
let selectedEmployee = false
let selectedDate = false
let selectedTime = false
let greet = 0
let customer = null
let customerField = ""
let customerFirstName = ""
let customerLastName = ""
let customerEmail = ""
let customerPhone = ""
let customerPhoneCountry = ""

/* init */
function init() {
    // let chatContainer = document.createElement('div')
    // chatContainer.id = 'chat-container'

    // iframe = document.createElement('iframe')
    // iframe.src = 'https://master.dttig9r6d49oq.amplifyapp.com/'
    // iframe.name = 'trafftChatBotiFrame'
    // iframe.height = '100%'
    // iframe.width = '100%'
    // iframe.scrolling = 'no'
    // iframe.style.border = 'none'

    // chatContainer.appendChild(iframe)
    // document.body.appendChild(chatContainer)

    /* tenant settings */
    ajaxCall(tenantUrl + 'api/v1/public/settings', 'GET', setTenantSettings)
    getChatBotSettings()
    setChatBotBtn()

    // showGreetPopupMsg()
    // if (!sessionStorage.getItem("greet")) {
    //   showGreetPopupMsg()
    // }

    //chatContainer = document.querySelector("#chat-container")
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
        chatPopup.classList.toggle('popup')
        //chatContainer.classList.toggle('shadow')
        
        setInitial()
       // hideGreetPopupMsg()
    })

    /* close chat popup */
    closeBtn.addEventListener('click', function() {
      chatPopup.classList.toggle('active')
      chatBtn.classList.toggle('active')
      chatArea.innerHTML = ''
      selectedLocation = false
      selectedEmployee = false
      selectedDate = false
      selectedTime = false
      greet = 0
    })

    /* send user response */
    sendBtn.addEventListener('click', function() {
      if (userMessageInput.value.trim() != '') {
        msg = userMessageInput.value

        /* customer info */
        if (customerField != "") {
          if (customerField == 'customerFirstName') {
            customerFirstName = userMessageInput.value.trim()
            msg = `/user_provide_first_name{"customerFirstName": ${customerFirstName}}`
          }

          if (customerField == 'customerLastName') {
            customerLastName = userMessageInput.value.trim()
            msg = `/user_provide_last_name{"customerLastName": ${customerLastName}}`
          }

          if (customerField == 'customerEmail') {
            msg = validateCustomerEmail(userMessageInput.value.trim())
            console.log(msg)

            if (msg === false) {
              return
            }
          }

          if (customerField == 'customerPhoneNumber') {
            msg = validateCustomerPhone(userMessageInput.value)

            if (msg === false) {
              return
            }
          }
        }

        data = {
          "message": msg,
          "sender": "User",
          "metadata": {
            "tenant": tenantUrl
          },
          "show": userMessageInput.value
        }
        console.log('Data: ' + data)

        if (customer) {
          data.metadata.customer = {
            "firstName": customerFirstName,
            "lastName": customerLastName,
            "email": customerEmail,
            "phoneNumber": customerPhone,
            "phoneCountryCode": customerPhoneCountry
          }
        }

        sendUserResponse(data)
      }
    })

    userMessageInput.addEventListener('keyup', function(event) {
      if (this.value.trim() != '') {
        document.documentElement.style.setProperty('--send', chatBot.accentColor)
      } else {
        document.documentElement.style.setProperty('--send', '#868E96')
      }

      if (event.key == 'Enter' && this.value.trim() != '') {
        event.preventDefault()
        msg = userMessageInput.value

        if (customerField != "") {
          if (customerField == 'customerFirstName') {
            customerFirstName = userMessageInput.value.trim()
            msg = `/user_provide_first_name{"customerFirstName": ${customerFirstName}}`
          }

          if (customerField == 'customerLastName') {
            customerLastName = userMessageInput.value.trim()
            msg = `/user_provide_last_name{"customerLastName": ${customerLastName}}`
          }

          if (customerField == 'customerEmail') {
            msg = validateCustomerEmail(userMessageInput.value.trim())

            if (msg === false) {
              return
            }
          }

          if (customerField == 'customerPhoneNumber') {
            msg = validateCustomerPhone (userMessageInput.value)

            if (msg === false) {
              return
            }
          }
        }

        let data = {
          "message": msg,
          "sender": "User",
          "metadata": {
            "tenant": tenantUrl
          },
          'show': userMessageInput.value
        }

        if (customer) {
          data.metadata.customer = {
            "firstName": customerFirstName,
            "lastName": customerLastName,
            "email": customerEmail,
            "phoneNumber": customerPhone,
            "phoneCountryCode": customerPhoneCountry
          }
        }

        sendUserResponse(data)
      }
    })

    document.addEventListener("click", function(e){
      const target = e.target;
      msg = null
      let data = {}

      /* choose service/location */
      if(target.classList.contains('chat-btn-book')){
        if (target.dataset.service) {
          msg = target.dataset.service
        }
        if (target.dataset.location && selectedLocation == false) {
          msg = target.dataset.location
          selectedLocation = true
        }
        if (target.dataset.employee && selectedEmployee == false) {
          msg = target.dataset.employee
          selectedEmployee = true
        }
      }

      /* choose date */
      if (target.classList.contains('date-slot') && selectedDate == false) {
        setActiveButton(target)
        msg = target.dataset.date
        selectedDate = true
      }

      /* choose time */
      if (target.classList.contains('time-slot') && selectedTime == false) {
        setActiveButton(target)
        msg = target.dataset.time
        selectedTime = true
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
  let msg =  document.querySelector('.chat-greet-msg') 
  msg.innerHTML = greetMessage
 // msg.classList.toggle('fade')
  sessionStorage.setItem("greet", "true")
}

function hideGreetPopupMsg () {
  let msg =  document.querySelector('.chat-greet-msg')
   msg.innerHTML = ''
   msg.style.opacity = 0  
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
  if (!greet) {
    sendGreetMessage()
    greet ++
  }
  
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
  if (chatBot.avatar != "null" && chatBot.avatar != '') {
    url = tenantUrl + `api/v1/public/media/${chatBot.avatar}?size=small`
  }

  document.querySelector('.chat-btn').style.backgroundImage=`url('${url}')`; 
}

/* validate customer email */
function validateCustomerEmail (email) {
  if (!email.includes('@')) {
    printUserResponse(email)
    userMessageInput.value = ''
    showLoader()
    setTimeout(() => {
      printBotResponse(JSON.stringify([
        {
          "text": "Please, type valid email adddress:"
        }
      ]))
    }, 1500)

    return false
  } 

  customerEmail = email
  return `/user_provide_email{"customerEmail": ${email}}`
}

/* validate customer phone */
function validateCustomerPhone (phone) {
  try {
    let lib = libphonenumber.parsePhoneNumber(phone)
    customerPhone = lib.number
    customerPhoneCountry = lib.country
    return `/user_provide_phone{"customerPhone": ${customerPhone}}`

  } catch(e) {
    console.log(e)
    printUserResponse(userMessageInput.value)
    userMessageInput.value = ''
    showLoader()
    setTimeout(() => {
      printBotResponse(JSON.stringify([
        {
          "text": "Phone number you provided is not valid. Please, type your phone number with the + and country prefix:s"
        }
      ]))
    }, 1500)

    return false
  }
}

/* send response */
function sendUserResponse (data) {
  let print = data.message
  if (data.show) {
    print = data.show
  }

  printUserResponse(print)
  sendBtn.src = 'https://cdn.statically.io/gh/stefani22tms/chatBot/master/plane.svg'
  userMessageInput.value = ''

  userMessageInput.blur()
  document.documentElement.style.setProperty('--send', '#868E96')
  showLoader()
  setBotAvatarImage()
  console.log(RASA_URL)
  console.log(tenantUrl)
  setTimeout(() => {
    ajaxCall(RASA_URL, 'POST', printBotResponse, JSON.stringify(data))
    userMessageInput.focus()
  }, 1500)

}

/* print responses */
function printUserResponse(message) {
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
    console.log(data)
    let loader = document.querySelector('.response-load');
    if (loader) {
      loader.remove()
    }
    
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

    if (data.length > 1) {
      if (data[1].attachment) {
        let attachment = JSON.parse(data[1].attachment)
        customerField = attachment.payload
        customer = {}
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

      if (index < chatBot.slotLimit) {
        template += printDateButtons(button.payload)
      }
      
    }

    if (button.type == 'time') {
      if (index == 0) {
        template += `<div class="chat-popup__main__bot-response__time-slot">`
      }

      if (index < chatBot.slotLimit) {
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
            <p>${formatPrice(service['price'])}</p>
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
  return `
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
  data.forEach((item, index) => {
    let string = ''
    if (item.type == 'service') {
      string = item.payload.name
    }

    if (item.type == 'date') {
      if (index < chatBot.slotLimit) {
        string = item.payload
      }
    }

    if (item.type == 'time') {
      if (index < chatBot.slotLimit) {
        string = formatTime(item.payload, item.duration)
      }
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

    if (string != '') {
      tags += `<span class='chat-popup__main__bot-response__msg__text__tag ${chatBot.theme == 'dark' ? 'tag-dark' : ''}'> 
        ${string}
      </span>`
    }

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

function formatPrice (price) {
  let thousandSeparatorMap = [',', '.', ' ', ' ']
  let decimalSeparatorMap = ['.', ',', '.', ',']

  let decimals = 2
  let currency = getCurrency()
  let position = 'before'
  let separator = ''

  for (let setting of settings) {
    if (setting.name == 'priceNumberOfDecimals') {
      decimals = setting.value
    }

    if (setting.name == 'priceSymbolPosition') {
      position = setting.value
    }

    if (setting.name == 'priceSeparator') {
      separator = setting.value
    }
  }

  let thousandSeparator = thousandSeparatorMap[separator - 1]
  let decimalSeparator = decimalSeparatorMap[separator - 1]

  let formattedPrice = price
  let roundedPrice = price.toFixed(decimals)

  if (position == 'before'){
    formattedPrice = currency + roundedPrice
  }
  if (position == 'beforeWithSpace'){
    formattedPrice = currency + ' ' + roundedPrice
  }    
  if (position == 'after') {
    formattedPrice = roundedPrice + currency
  }     
  if (position == 'afterWithSpace') {
    formattedPrice = roundedPrice + ' ' + currency
  }
        
  return formattedPrice
}

function formatTime (time, duration) {
  let [timeSlot, format] = time.split(' ')
  let [hours, minutes] = timeSlot.split(':'); 
  let date = new Date();
  date.setHours(hours, minutes, date.getSeconds() + duration);
  let newTime = date.toTimeString().slice(0, 5);
  if (format) {
    newTime += ' ' + format
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

