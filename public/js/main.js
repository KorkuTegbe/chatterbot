const socket = io();
// ui elements
const form = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')


socket.on('bot-message', message => {
    // output message
    outputMessage('chatterbot', message)

    // Scroll down to message
    chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('user-message', message => {
    // output message
    outputMessage('You', message)
    // Scroll down to message
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// send message
form.addEventListener('submit', e => {
    e.preventDefault();
    // get message value
    let msg = e.target.elements.msg.value

    if(!msg) return false;

    // emit message to server
    socket.emit('user-message', msg)
    // socket.emit('private-message', msg)

    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})


// function to output message from server
const outputMessage = (sender, message) => {
    const div = document.createElement('div')
    if(sender === 'Chatterbox') { div.classList.add('bot-message') }
    else{ div.classList.add('user-message')}
    const messageSection = document.createElement('div')
    messageSection.classList.add('message-section')
    // div.appendChild(messageSection)
    messageSection.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    div.appendChild(messageSection)
    chatMessages.appendChild(div)
}