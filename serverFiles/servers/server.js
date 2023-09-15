const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const db = require('./DBOp.js');

const PORT = 8080;
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/loginPage/sign-in.html');
});

app.get('/css', (req, res) => {
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/loginPage/sign-inPage.css');
});

app.get('/signup', (req,res)=>{
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/signupPage/sign-up.html');
});

app.get('/sucss', (req, res) => {
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/signupPage/sign-up.css');
});

//main chat page
app.get('/chatPage', (req, res)=>{
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/mainPage/ui.html');
});

app.get('/sendMessage.js', (req, res)=>{
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/mainPage/sendMessage.js');
});

app.get('/chatDB2.js', (req, res)=>{
    res.setHeader('Content-Type','application/javascript');
    res.sendFile('/home/eshan/chatApp/project/serverFiles/html/mainPage/chatDB2.js');
});

app.get('/users', (req, res)=>{
    db.getAllUsers(req.query.user)
    .then(usersList =>{
        res.send(usersList);
        console.log(usersList);
    })
    .catch(err =>{
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

app.post('/',(req, res)=>{
    //save the username and password in the database
    db.addIntoDB(req.body.username, req.body.password1);

    //create a collection in messages database to store that account's messages
    
    res.redirect('/');
});

app.post('/checkLogIn', (req,res)=>{

    db.checkAuth(req.body.username, req.body.password1)
    .then(auth =>{
        console.log(auth);
        if(auth == true){
            //add the username and the IP address of the username to db
            res.redirect('/chatPage');
        }else{
            res.redirect('/');
        }
    })
    .catch(err=>{
        console.log(err);
    })

    // db.checkAuth(req.body.username, req.body.password1, (auth)=> {
    //     if(auth == true){
    //         //add the username and the IP address of the username to db
    //         res.redirect('/chatPage');
    //     }else{
    //         res.redirect('/');
    //     }
    // });
});

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});