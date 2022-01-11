const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//enlist the items- grouping by the given category and user_id

//add a new Item to the category with respect to the user_id

//modify the category to the already added item: edit the category or delete the item
