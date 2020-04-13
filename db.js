const promise = require('bluebird')
const pg = require('pg-promise')
const dotenv = require('dotenv')

dotenv.config();

const options = {
  promiseLib: promise
};
const pgp = pg(options);

const connectionSring = process.env.DATABASE_URL

const db = pgp(connectionSring);


module.exports = db;