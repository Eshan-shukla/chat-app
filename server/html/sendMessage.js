//open connection
const url = "ws://81.111.75.45:7000";
const wsServer = new WebSocket(url);



wsServer.onopen = (event)=>{
    
} 

//handle messages received from the server
wsServer.onmessage = (event)=>{
    
    const chatContainer = document.getElementById('message-list');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'server-message');
    messageElement.textContent = event.data;
    chatContainer.appendChild(messageElement);
}

wsServer.onclose = (event)=>{
    console.log("close");
}

function sendMessage(){
    var message = document.getElementById('message-input');
    var messageToSend = message.value;
    
    const chatContainer = document.getElementById('message-list');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'user-message');
    messageElement.textContent = messageToSend;
    chatContainer.appendChild(messageElement);

    
    wsServer.send(messageToSend);
    message.value = '';
}

