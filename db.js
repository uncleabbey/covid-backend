const promise = require('bluebird')
const pg = require('pg-promise')

const options = {
  promiseLib: promise
};
const pgp = pg(options);

const connectionSring = 'postgres://ylnyxvtjzvomff:fbe4fb2c2713d98564c292a09d23c21848c6a5062e4dc1271cdb40ca4824cf5c@ec2-34-200-101-236.compute-1.amazonaws.com:5432/df6amkq6k8f7v8';

const db = pgp(connectionSring);


module.exports = db;