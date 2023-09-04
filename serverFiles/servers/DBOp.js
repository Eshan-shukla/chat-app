const mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//add data into database
module.exports.addIntoDB = (username, password)=>{
  MongoClient.connect(url, async function(err, db) {

    if (err) throw err;
  
    var dbo = db.db("accounts");
    var myobj = { name: username, password: password };
    
    dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;

      console.log("1 document inserted");

      db.close();
    });
  }); 

};

//authenticate user credentials
module.exports.checkAuth = (username, password, callback)=>{
  MongoClient.connect(url, async function(err, db) {

    if (err) throw err;
  
    var dbo = db.db("accounts");
  
    const doc = await dbo.collection("users").findOne({name:username, password:password});

    if(doc == null){
      callback(false);
      console.log("false")
    }else{
      console.log("true")
      callback(true);
    }
    
    db.close();
  }); 
}

module.exports.addMessageIntoDB = async (sender, receiver, message) => {
  let db;
  try {
    db = await MongoClient.connect(url);

    const dbo = db.db("messages");

    const doc = await dbo.collection(sender).findOne({ with: receiver });
    console.log(doc);
    if (doc == null) {
      // Insert for the first time into the DB
      const text = '!' + message;
      const obj = { with: receiver, messages: [text] };
      await dbo.collection(sender).insertOne(obj);

      console.log("message entered");
    } else {
      console.log("inside else !");
      const text = '!' + message;
      await dbo.collection(sender).updateOne(
        {with : receiver},
        {$push : {messages: text}}
      )
    }

    // The same should be done with the receiver
    const doc2 = await dbo.collection(receiver).findOne({ with: sender });
    console.log(doc2);
    if (doc2 == null) {
      // Insert for the first time into the DB
      const text = '#' + message;
      const obj = { with: sender, messages: [text] };
      await dbo.collection(receiver).insertOne(obj);

      console.log("message entered");
    } else {
      const text = '#' + message;
      await dbo.collection(receiver).updateOne(
        {with : sender},
        {$push : {messages: text}}
      )
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (db) {
      db.close();
    }
  }
};



//add text message into database
// module.exports.addMessageIntoDB = (sender, receiver, message)=>{
//   MongoClient.connect(url, async function(err, db) {

//     if (err) throw err;
  
//     var dbo = db.db("messages");

//     const doc = await dbo.collection(sender).findOne({with:receiver});
//     if(doc==null){
//       //insert for the first time into the DB
//       const text = '!'+message;
//       const obj = {with: receiver, messages:[text]};
//       dbo.collection(sender).insertOne(obj, function(err,res){
//         if (err) throw err;
        
//         console.log("message eneterd");
//         //db.close();
//       });
//     }else{
//       const text = '!'+message;
//       doc.messages.push(text);
//     }

//     //same should be done with receiver
//     const doc2 = await dbo.collection(receiver).findOne({with:sender});
//     if(doc2==null){
//       //insert for the first time into the DB
//       const text = '#'+message;
//       const obj = {with: sender, messages:[text]};
//       dbo.collection(receiver).insertOne(obj, function(err,res){
//         if (err) throw err;
        
//         console.log("message eneterd");
//         //db.close();
//       });
//     }else{
//       const text = '#'+message;
//       doc2.messages.push(text);
//     }
    
//     db.close();
//   }); 

// };
