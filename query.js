var db = require('./db');


const createQuery =  `
            CREATE TABLE IF NOT EXISTS logs  (
            id SERIAL PRIMARY KEY,
            log text NOT NULL
            )`
const createTable = () => {
  return new Promise((resolve, reject) => {
    db.none(createQuery)
        .then(() => {
          console.log('Succesfully Created Table');
          resolve();
        })
        .catch(error => {
          console.log('Error', error);
          reject();
        });
  })
}

const insertQuery = `
  INSERT INTO logs (log) VALUES ($1) RETURNING log
`

const insertLogs = (log) => {
  return new Promise((resolve, reject) => {
    db.one(insertQuery, [log]).then(res => {
        console.log(res);
        resolve(res);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
  })
}
const getQuery = `SELECT * from logs`

const getLogs = () => {
  return new Promise((resolve, reject) => {
    return db
      .manyOrNone(getQuery)
      .then(res => {
        console.log(res);
        return resolve(res);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        reject(err);
      });
  });
}
module.exports = {
  createTable,
  insertLogs,
  getLogs
}