const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const db = require('./DBOp.js');
const path = require('path');

const PORT = 5000;
const app = express();
app.use(cors());

// Middleware to parse JSON data in the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const p = path.dirname('/home/eshan/chat-app/serverFiles/html/')

app.get('/', (req, res)=>{
    res.sendFile(path.join(p, '/html/loginPage/sign-in.html'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/loginPage/sign-in.html');
});

app.get('/css', (req, res) => {
    res.sendFile(path.join(p, '/html/loginPage/sign-inPage.css'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/loginPage/sign-inPage.css');
});

app.get('/signup', (req,res)=>{
    res.sendFile(path.join(p, '/html/signupPage/sign-up.html'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/');
});

app.get('/sucss', (req, res) => {
    res.sendFile(path.join(p, '/html/signupPage/sign-up.css'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/signupPage/sign-up.css');
});

app.get('/checkCredentials', (req, res)=>{

    db.checkAuth(req.query.username, req.query.password)
    .then(auth =>{
        if(auth == true){
            //add the username and the IP address of the username to db
            res.sendFile(path.join(p, '/html/mainPage/ui.html'));
        }
    })
    .catch(err=>{
        console.log(err);
    })
});


app.get('/sendMessage.js', (req, res)=>{
    res.sendFile(path.join(p, '/html/mainPage/sendMessage.js'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/mainPage/sendMessage.js');
});

app.get('/chatDB2.js', (req, res)=>{
    res.setHeader('Content-Type','application/javascript');
    res.sendFile(path.join(p, '/html/mainPage/sendMessage.js'));
    //res.sendFile('/home/eshan/chatApp/project/serverFiles/html/mainPage/chatDB2.js');
});

app.get('/users', (req, res)=>{
    db.getAllUsers(req.query.user)
    .then(usersList =>{
        res.send(usersList);
    })
    .catch(err =>{
        console.log(err);
    })
});

app.get('/check', (req,res)=>{
    db.checkUserExists(req.query.username)
    .then(found =>{
        res.send(found);
    })
    .catch(err=>{
        console.log(err);
    })
});

app.get('/messages', (req, res)=>{
    db.getAllMessages(req.query.accountName, req.query.chatWith)
    .then(messageList =>{
        res.send(messageList);
    })
    .catch(err =>{
        console.log(err);
    })
});


 //save the username and password in the mongodb database
app.post('/',(req, res)=>{

    db.addIntoDB(req.body.username, req.body.password);

    res.redirect('/');
});

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});