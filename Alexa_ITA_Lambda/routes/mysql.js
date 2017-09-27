var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : '34.224.101.89',
	    user     : 'itraveldb-user',
	    password : 'itraveldb',
	    database : 'iTravelDB',
	    port	 : 3306
	});
	return connection;
}


function fetchData(callback, sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR  While Fetching: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}

function insertData(callback, sqlQuery)
{
    console.log("\nSQL Query::"+sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, rows, fields){
        if(err)
        {
            console.log("Error While Inserting :"+err.message);
        }
        else
        {
            callback(err,rows);
        }
    });
}

exports.fetchData=fetchData;
exports.insertData=insertData;