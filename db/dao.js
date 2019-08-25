const sqlite = require('sqlite3');
const Promise = require('bluebird');
/* Application Data Access Object
*/
class AppDAO {
    constructor (dbFilePath){
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if(err){
                console.log("Sin conexión a BD", err);
            }else{
                console.log("Conexión a BD correcta");
            }
        })
    };
    run(sql, params = []){
        return new Promise((resolve, reject)=>{
            this.db.run(sql, params, function(err){
                if(err){
                    console.log("Error sql: " + sql);
                    console.log(err);
                    reject(err);
                }else{
                    resolve({ id: this.lastID });
                }
            })
        })
    }
}
module.exports = AppDAO;