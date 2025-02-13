const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#message-location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Autoscrolling
const autoscroll = ()=>
{
    // New message
    const $newMessage = $messages.lastElementChild

    // Height of the latest message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseFloat(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height Of message container
    const containerHeight = $messages.scrollHeight

    //How far Have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    
    if(containerHeight-newMessageHeight<=(scrollOffset+1))
    {
        $messages.scrollTop = $messages.scrollHeight
    }

}
//Displaying sent Messages, moment() inbuilt js lib to help with time formatting
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//Displaying Location shared via Link
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username:message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
    
})

// For sidebar scroll list
socket.on('roomData', ({ room, users})=>
{
     const html = Mustache.render(sidebarTemplate,{
         room,
         users
     })
     document.querySelector('#sidebar').innerHTML = html
})

//Form UI settings
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()


        if (error) {
            return console.log(error)
        }

        console.log('Message Delivered!')
    })
})

//Location UI settings
$locationButton.addEventListener('click', () => {
    $locationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        return alert('Geolocation feature is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location Shared!')
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
      if(error)
      {
          alert(error)
          location.href = '/'
      }
})