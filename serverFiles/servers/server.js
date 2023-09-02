const bodyParser = require('body-parser');
const express = require('express');
const db = require('./DBOp.js');

const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/html/loginPage/sign-in.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/html/loginPage/sign-inPage.css');
});

app.get('/signup', (req,res)=>{
    res.sendFile(__dirname + '/html/signupPage/sign-up.html');
});

app.get('/sucss', (req, res) => {
    res.sendFile(__dirname + '/html/signupPage/sign-up.css');
});

//main chat page
app.get('/chatPage', (req, res)=>{
    res.sendFile(__dirname + '/html/mainPage/ui.html');
});

app.get('/sendMessage.js', (req, res)=>{
    res.sendFile(__dirname + '/html/mainPage/sendMessage.js');
});

app.get('/chatDB2.js', (req, res)=>{
    res.setHeader('Content-Type','application/javascript');
    res.sendFile(__dirname + '/html/mainPage/chatDB2.js');
});


app.post('/',(req, res)=>{
    //save the username and password in the database
    db.addIntoDB(req.body.username, req.body.password1);

    //create a collection in messages database to store that account's messages
    
    res.redirect('/');
});

app.post('/checkLogIn', (req,res)=>{

    db.checkAuth(req.body.username, req.body.password1, (auth)=> {
        if(auth == true){
            //add the username and the IP address of the username to db
            res.redirect('/chatPage');
        }else{
            res.redirect('/');
        }
    });
});

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});