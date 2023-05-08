const express = require('express');

const PORT = 8080;
const app = express();

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/html/ui.html');
});

app.get('/sendMessage.js', (req, res)=>{
    res.sendFile(__dirname + '/html/sendMessage.js');
});

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});