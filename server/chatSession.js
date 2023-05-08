
const websocket = require('ws');
const wss = new websocket.Server({port:7000});


wss.on("connection", (ws,req)=>{        
    console.log(req.socket.remoteAddress);
    ws.on('error', ()=>{
        console.error;
    });

    
    //this function gets triggered when it receives a message from the client
    ws.on("message", (messageFromClient)=>{

        //here I'll direct the message coming from shiva bhaiya to me.
        wss.clients.forEach((client)=>{
            if(client != ws && client.readyState === websocket.OPEN){
                client.send(messageFromClient.toString());
            }
            
        });      
        
    });

    ws.on("close", ()=>{
        console.log("Connection closed!");
        
    });
});