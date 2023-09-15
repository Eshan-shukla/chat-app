//const mysql = require('mysql');
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

// Function to check user authentication
module.exports.checkAuth = async (username, password) => {
  try {
    // Initialize the client (connect to the database)
    const client = new MongoClient(url);
    //await initializeClient();

    await client.connect();

    // Get a reference to the database and collection
    const db = client.db('accounts');
    const usersCollection = db.collection('users');

    // Query the database to find the user
    const doc = await usersCollection.findOne({ name: username, password: password });

    // Close the database connection
    await client.close();

    // Check if a user was found
    if (doc) {
      console.log('Authentication successful');
      return true;
    } else {
      console.log('Authentication failed');
      return false;
    }
  } catch (err) {
    console.error('Error in checkAuth:', err);
    throw err; // Rethrow the error to indicate an issue with the authentication process
  }
};


module.exports.getAllUsers = async(username)=> {
  const client = new MongoClient(url);
  usersList = [];
  try {
    await client.connect();

    const db = client.db("messages");
    const collection = db.collection(username);

    // Find all documents in the collection and add them to an array
    const cursor = collection.find({});

    // Iterate over the documents using a loop
    while (await cursor.hasNext()) {
      const document = await cursor.next();
      usersList.push(document.with);
      //console.log(document);
    }

    return usersList;
  }catch (err) {
    console.error('Error in checkAuth:', err);
    throw err; // Rethrow the error to indicate an issue with the authentication process
  } 
  finally {
    client.close();
  }
}

module.exports.getAllMessages = async(accountName, chatWith) =>{
  const client = new MongoClient(url);

  messageList = [];
  try {
    await client.connect();

    const db = client.db("messages");
    const collection = db.collection(accountName);

    // Find all documents in the collection and add them to an array
    const doc = await collection.findOne({with : chatWith});
    
    if (doc) {
      messageList = await doc.messages;
      return messageList;
    } else {
      console.log('User not found');
    }
    

  }catch (err) {
    console.error('Error in checkAuth:', err);
    throw err; // Rethrow the error to indicate an issue with the authentication process
  } 
  finally {
    client.close();
  }
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


