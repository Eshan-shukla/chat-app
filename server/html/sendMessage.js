//open connection
const url = "ws://81.111.75.45:7000";
const wsServer = new WebSocket(url);

getAllUsers((users) => {
    var userElement;
    console.log("inside sendMessage: " + users);
    const len = users.length;
    for (let i = 0; i < len; ++i) {
        let u = users[i];
        var userList = document.querySelector('#user-list');
        userElement = document.createElement('li');
        userElement.textContent = u;
        userList.appendChild(userElement);

        // Create a closure by wrapping the event listener in an immediately-invoked function expression (IIFE)
        (function(element) {
            element.addEventListener('click', function(event) {
                var heading = document.getElementById('username');
                var text = event.target.textContent;
                console.log(text);
                heading.textContent = text;
                const chatContainer = document.getElementById('message-list');
                chatContainer.innerHTML='';
                selectUser(element.innerText);
            });
        })(userElement);
    }
});


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

        //add to the messageArray
        addToIndexedDB(username, '#'+parsedMessage.text);    //# indicates left side
    }
    
}

wsServer.onclose = (event)=>{
    console.log("close");
}

//send message to the server
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

        //send it to indexedDB  
        addToIndexedDB(username, '!'+messageToSend);    //! indicates right side
        message.value = '';
    }
    
}

//add users to the list
function addToList(){
    var users = document.getElementById('user-input-field');
    var user = users.value;
    var userList = document.querySelector('#user-list');
    var userElement = document.createElement('li');
    userElement.textContent = user;
    userList.appendChild(userElement);
    users.value = '';

    // Add click event listener to the user element
    userElement.addEventListener('click', function() {
        var heading = document.getElementById('username');
        heading.textContent = user;
        const chatContainer = document.getElementById('message-list');
        chatContainer.innerHTML='';
        selectUser(user);
    });
}

function selectUser(user){
    //retrieve messages from messageArray and show it to the user
    getMessageArray(user, (messageArray)=>{
        let len = messageArray.length;
        
        //iterate through the message array and classify them
        for(let i = 0; i < len; ++i){
            let s = messageArray[i];
            if(s[0] == '!'){        
                s = s.slice(1);
                const chatContainer = document.getElementById('message-list');
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message', 'user-message');
                messageElement.textContent = s;
                chatContainer.appendChild(messageElement);

            }else{
                s = s.slice(1);
                const chatContainer = document.getElementById('message-list');
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message', 'server-message');
                messageElement.textContent = s;
                chatContainer.appendChild(messageElement);
            }  
        }
    });
    
}

