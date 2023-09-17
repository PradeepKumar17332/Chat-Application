const config = require('../db_config');
const mysql = require('mysql');
  
const pool = mysql.createPool(config.db);
query = (sql) =>{
    console.log("The query is: ", sql);
    return new Promise((resolve, reject)=>{
        pool.query(sql,  (error, elements)=>{
            if(error){
                console.log("There was an error while query: ", error);
                return null;
            }
            // console.log("The output of query is: ", elements);
            return resolve(elements);
        });
    });
};
module.exports = {
    query
}