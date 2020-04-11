var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
    console.error(err)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`
        CREATE TABLE IF NOT EXISTS logs  (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log text NOT NULL
            )`,
        (err) => console.log(err)
        );  
    }
});


module.exports = db