
const websocket = require('ws');
const wss = new websocket.Server({port:7000});

const map = new Map();

wss.on("connection", (ws,req)=>{        
    var user = '';
    //get the username from the req body and create a list of username, ws
    ws.on('error', ()=>{
        console.error;
    });

    
    //this function gets triggered when it receives a message from the client
    ws.on("message", (messageFromClient)=>{
        firstChar = messageFromClient.toString().charAt(0);
        if(firstChar=='@'){
            map.set(messageFromClient.toString(), ws);
            user = messageFromClient.toString();
            console.log(user);
        }else{
            parsedMessage = JSON.parse(messageFromClient);
            var {source, destination, text} = parsedMessage;
            destinationSocket = map.get(destination);
            //here I'll direct the message coming from shiva bhaiya to me.
            wss.clients.forEach((c)=>{
            if(c == destinationSocket && c.readyState === websocket.OPEN){
                const msg = {
                    source: source, 
                    destination : destination,
                    text : text,
        
                }
                c.send(JSON.stringify(msg));
            }
            
            }); 

        }
             
        
    });

    ws.on("close", ()=>{
        map.delete(user);
        console.log("Connection closed!");
        
    });
});