const db = require('./DBOp.js');




// db.getAllUsers('eshan')
//     .then(usersList =>{
//         console.log(usersList);
//     })
//     .catch(err =>{
//         console.log(err);
//     })

    db.getAllMessages('eshan','anish')
    .then(messageList =>{
        console.log(messageList);
    })
    .catch(err =>{
        console.log('this is the error'+err);
    })



    // db.checkAuth('eshan','eshan')
    // .then(auth =>{
    //     console.log(auth);
    // })
    // .catch(err=>{
    //     console.log(err);
    // })

    // db.checkAuth('eshan','eshan', (auth)=> {
    //     if(auth == true){
    //         //add the username and the IP address of the username to db
    //         //res.redirect('/chatPage');
    //         console.log('true');
    //     }else{
    //         //res.redirect('/');
    //         console.log('false');
    //     }
    // });