

//insert a message to the indexedDB according to a particular user
function addToIndexedDB(user, message) {
    const request = indexedDB.open("chats",1);
    let db, tx, store;

    request.onupgradeneeded = (e)=>{
        db = request.result;
        store = db.createObjectStore("messages",{keyPath: "user"});
    }

    request.onsuccess = (e)=>{
        db = request.result;
        tx = db.transaction("messages", "readwrite");
        store = tx.objectStore("messages");
  
        const req = store.get(user); 

        req.onsuccess = (event) => {
            let chatMessage = event.target.result;
  
            if (chatMessage) {
                let m = chatMessage.message; 
                m.push(message);
            
            } else {
                chatMessage = { user: user, message: [message] }; 
            }

            store.put(chatMessage); // Store the updated chat message array back into IndexedDB
        };

        req.onerror = (event) => {
            console.error("Error retrieving chat message array:", event.target.error);
        };

        tx.oncomplete = () => {
            console.log("Chat message array updated successfully.");
        };
        }

    request.onerror = (e)=>{
        console.log(e);
    }   
}

//retrieve the message array of a particular user and return it
function getMessageArray(user, callback){   //user-"aashu"
    const request = indexedDB.open("chats",1);
    let db, tx, store;

    request.onupgradeneeded = (e)=>{
        db = request.result;
        store = db.createObjectStore("messages",{keyPath: "user"});
    }

    request.onsuccess = (e)=>{
        db = request.result;
        tx = db.transaction("messages", "readwrite");
        store = tx.objectStore("messages");
        const req = store.get(user); "aashu"

        req.onsuccess = (event) => {
            let chatMessage = event.target.result;
            let m = chatMessage.message;
            callback(m);    //return messagearray
        };

        req.onerror = (event) => {
            console.error("Error retrieving chat message array:", event.target.error);
        };

        tx.oncomplete = () => {
            console.log("Chat message array updated successfully.");  
        };
        }

    request.onerror = (e)=>{
        console.log(e);
    }  
}

//retrieve all the users present in the indexedDB
function getAllUsers(callback){
    const request = indexedDB.open("chats",1);
    let db, tx, store;

    request.onupgradeneeded = (e)=>{
        db = request.result;
        store = db.createObjectStore("messages",{keyPath: "user"});
    }

    request.onsuccess = (e)=>{
        db = request.result;
        tx = db.transaction("messages", "readwrite");
        store = tx.objectStore("messages");
        let users = [];
        const req = store.openCursor();
        req.onsuccess = function(event){
            const cursor = event.target.result;
            if(cursor){
                //console.log(cursor.value.user);
                users.push(cursor.value.user);
                cursor.continue();    
            }else{
                callback(users);
            }
        }

        req.onerror = function(event){
            console.log(event);
        }
        }

    request.onerror = (e)=>{
        console.log(e);
    }
    
}