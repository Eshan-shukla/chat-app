const mysql = require('mysql');

//add data into database
module.exports.addIntoDB = (username, password)=>{
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "21719528",
  });

    con.connect(function(err) {
        if (err) throw err;

        var sql = `INSERT INTO ChatApp.ACCOUNT (username, password) VALUES ('${username}', '${password}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
        });
        con.end();
      });

};

//authenticate user credentials
module.exports.checkAuth = (username, password, callback)=>{
  var auth = false;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "21719528",
  });

  con.connect(function(err){
    if(err) throw err;
  });

  var sql = "SELECT username, password FROM ChatApp.ACCOUNT";
  con.query(sql, function(err,result,fields){
    if(err) throw err;

    var len = result.length;
          for(var i = 0; i < len; ++i){
            if(result[i].username == username && result[i].password == password){
              auth = true;
            }
          }
          callback(auth);
          con.end();
  });
}

