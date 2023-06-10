const bodyParser = require('body-parser');
const express = require('express');
const db = require('./DBOp.js');

const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/html/loginPage/login.html');
});

app.get('/signup', (req,res)=>{
    res.sendFile(__dirname + '/html/signupPage/signup.html');
});

//main chat page
app.get('/chatPage', (req, res)=>{
    res.sendFile(__dirname + '/html/ui.html');
    //res.sendFile('/home/eshan/Desktop/chatuitest.html')
});

app.get('/sendMessage.js', (req, res)=>{
    res.sendFile(__dirname + '/html/sendMessage.js');
});

app.post('/',(req, res)=>{
    //save the username and password in the database
    db.addIntoDB(req.body.username, req.body.password1);
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