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
