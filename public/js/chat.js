//------Client Side-------
const socket = io()

// server (emit) -> client (reciever) --acknowledgement-->server
// client (emit) -> server (reciever) --acknowledgement-->server

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages') //render location

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options--------------------------
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true})


//autoscroll function
const autoscroll = () =>{
    //new message element
    const $newMessage = $messages.lastElementChild

    const $newMessageStyles = getComputedStyle($newMessage)
    const $newMessageMargin = parseInt($newMessageStyles.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin

    //console.log($newMessageMargin)
    //Visible height
    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight

    //How far have u scrolled
    const scrolledOffSet = $messages.scrollTop + visibleHeight

    if(containerHeight - $newMessageHeight <= scrolledOffSet){
        $messages.scrollTop = $messages.scrollHeight
    }

}

//Msg template---------------------
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

//Location template--------------------
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//Render user---------------------------
socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

//Message Form----------------------------------
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable form to prevent double click and clear field after msg is send or an input is submitted
    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        //console.log('The message was delivered!',message)
        //enable form
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '' // clearing field after sent
        $messageFormInput.focus() //remove mouse pointer in the field

        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

//Location submission-------------------------
$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendLocation.removeAttribute('disabled')
            console.log('Location shared')
        })
        //$locationButton.removeAttribute('disabled')
    })
})

socket.emit('join', {username,room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/' //redirect to homepage - login
    }
})






// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated', count)
// }) 

// //Event listener from html file
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment') //sending event to server - 'name of the event'
// })