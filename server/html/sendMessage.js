//open connection
const url = "ws://81.111.75.45:7000";
const wsServer = new WebSocket(url);

wsServer.onopen = (event)=>{
    //send the username to the server so that it can create a list
    let username = localStorage.getItem("username");
    u = '@'+ username;
    wsServer.send(u);
} 

//handle messages received from the server
wsServer.onmessage = (event)=>{
    var username = document.getElementById("username").innerText;
    //event is of json type
    parsedMessage = JSON.parse(event.data);
    var source = parsedMessage.source;
    console.log(source);
    if(source == username){
        const chatContainer = document.getElementById('message-list');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'server-message');
        messageElement.textContent = parsedMessage.text;
        chatContainer.appendChild(messageElement);
    }
    
}

wsServer.onclose = (event)=>{
    console.log("close");
}

function sendMessage(){
    var username = document.getElementById("username").innerText;
    if(username == ''){
        alert("Enter the username");
    }else{
        var message = document.getElementById('message-input');
        var messageToSend = message.value;
    
        const chatContainer = document.getElementById('message-list');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'user-message');
        messageElement.textContent = messageToSend;
        chatContainer.appendChild(messageElement);

        u = '@'+username;
        let source = localStorage.getItem("username");
        const msg = {
            source: source, 
            destination : u,
            text : messageToSend,

        }
    
        wsServer.send(JSON.stringify(msg));
        message.value = '';

    }
    
}

//add users to the list
function addToList(){
    var user = document.getElementById('user-input-field').value;
    var userList = document.querySelector('#user-list');
    var userElement = document.createElement('li');
    userElement.textContent = user;

    // Add click event listener to the user element
    userElement.addEventListener('click', function() {
        selectUser(user);
    });

    userList.appendChild(userElement);

}

//
function selectUser(user){
    var heading = document.getElementById('username');
    heading.textContent = user;

    const chatContainer = document.getElementById('message-list');
    chatContainer.innerHTML='';
}

