const { pool } = require('pg');
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);

db.connect(() => {
  console.log("The database has been connected.");
});

module.exports = db;
