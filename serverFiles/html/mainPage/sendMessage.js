//open connection
const urll = "ws://192.168.1.9:8000";
const httpUrl = "http://192.168.1.9:5000";
const wsServer = new WebSocket(urll);


wsServer.onopen = (event)=>{
    //send the username to the server so that it can create a list
    let username = localStorage.getItem("username");
    u = '@'+ username;
    wsServer.send(u);

    const url = httpUrl +  '/users?user='+username; // Replace with the URL you want to fetch

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    //return response.text(); // or .json() if the response is JSON
    return response.json(); // Parse the response as JSON
  })
  .then((users) => {
    //get all the users from the server that this account has interacted with. 
    //and display them on the lefthand side of the screen below the search tab
    console.log(users);
    var userElement;
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
                // Create a horizontal line element
                const horizontalLine = document.createElement('hr');
                const chatContainer = document.getElementById('message-list');
                chatContainer.innerHTML='';
                chatContainer.appendChild(horizontalLine);
                selectUser(element.innerText); //restores old messages 
            });
        })(userElement);
    }
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });

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

    }else{
      console.log("inside else");
        //now once user clicks on the on the li tag retrieve all the messages and display here
        var userList = document.querySelector('#user-list');
            const liElements = userList.querySelectorAll('li');

            var foundInList = false;

            // Iterate through the NodeList of <li> elements 
            liElements.forEach((li) => {
              // Access each <li> element
              //console.log(`${li.textContent}`);
              if(li.textContent == source){
                //alert("User already present in the list.");
                //users.value = '';
                foundInList = true;
              }
            });
            if(!foundInList){
              addList(source);
             // users.value = '';
            }

        //check the source of the message if the sender of this message exists in the DB
        //then add this message to that array otherwise create a new list in the user-list
        //and then add the data 
    //     getAllUsers((users)=>{
    //         var found = false;
    //         const len = users.length;
    //         for(let i=0; i < len; ++i){
    //             var user = users[i];

    //             //sender is present in the DB no need to create a new list
    //             if(source == user){
    //                 found = true;
    //                 //add to the messageArray
    //                 addToIndexedDB(source, '#'+parsedMessage.text);    //# indicates left side
    //                 break;
    //             } 
    //         }

    //         //if user is not present in the DB then add a list and to the DB
    //         if(!found){
    //             addList(source);
    //             addToIndexedDB(source, '#'+parsedMessage.text);
    //         }
    //     });
    }
    
}

wsServer.onclose = (event)=>{
    console.log("close");
}

//send message to the server
function sendMessage(){
    var username = document.getElementById("username").innerText;
    if(username == 'username'){
        alert("Enter the username");
    }else{
        var message = document.getElementById('message-input');
        var messageToSend = message.value;
        const chatContainer = document.getElementById('message-list');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'user-message');
        messageElement.textContent = messageToSend;
        chatContainer.appendChild(messageElement);

        u = username;
        let source = localStorage.getItem("username");
        console.log(source + u);
        const msg = {
            source: source, 
            destination : u,
            text : messageToSend,

        }
        wsServer.send(JSON.stringify(msg));
        message.value = '';
    }
    
}

function addToList(){
    var users = document.getElementById('user-input-field');
    var user = users.value;

    //if user is same as the account username alert about it
    const n = localStorage.getItem("username");
    if(n == user){
      alert("This is same as your account name");
    }
    else{
    const url = httpUrl + '/check?username='+user;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        //return response.text(); // or .json() if the response is JSON
        return response.json(); // Parse the response as JSON
      })
      .then((found) => {
        if(found){
            var userList = document.querySelector('#user-list');
            const liElements = userList.querySelectorAll('li');

            var foundInList = false;

            // Iterate through the NodeList of <li> elements 
            liElements.forEach((li) => {
              // Access each <li> element
              console.log(`${li.textContent}`);
              if(li.textContent == user){
                alert("User already present in the list.");
                users.value = '';
                foundInList = true;
              }
            });
            if(!foundInList){
              addList(user);
              users.value = '';
            }
            
        }else{
            alert("Username does not exist");
            users.value = '';
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
    
}

//add user to the list 
function addList(user){
    var userList = document.querySelector('#user-list');
    var userElement = document.createElement('li');
    userElement.textContent = user;
    userList.appendChild(userElement);

    // Add click event listener to the user element
    userElement.addEventListener('click', function() {
        var heading = document.getElementById('username');  
        heading.textContent = user;

        // Create a horizontal line element
        const horizontalLine = document.createElement('hr');

        const chatContainer = document.getElementById('message-list');
        chatContainer.innerHTML='';
        chatContainer.appendChild(horizontalLine);  
        selectUser(user);
    });
}

function selectUser(user){  //user-"aashu"
    //Get all the previous messages from the server 
    let accountName = localStorage.getItem("username");
    const url =  httpUrl + '/messages?accountName='+accountName+'&chatWith='+user;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    //return response.text(); // or .json() if the response is JSON
    return response.json(); // Parse the response as JSON
  })
  .then((messageArray) => {
    console.log(messageArray)
    let len = messageArray.length;
    for(let i = 0; i < len; ++i){
        let s = messageArray[i];
        if(s[0] == '!'){        
            s = s.slice(1); //""
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
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });
}



    


