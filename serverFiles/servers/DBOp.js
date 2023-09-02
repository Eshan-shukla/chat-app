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

