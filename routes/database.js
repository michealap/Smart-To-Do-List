const db = require('../db/dbSetUp');

//enlist the items- grouping by the given category and user_id
const enlistItems = function(category, user_id = 1) {
  const values = [category, user_id];
  let queryString = `
  SELECT * FROM queries
  WHERE category = $1
  AND user_id = $2`;
  return db.query(queryString, values)
    .then(data => {
      const items = data.rows;
      //return an array of objects
      return items;
    })
    .catch(err => {
      console.log(err.message);
    });
};
//add a new Item to the category with respect to the user_id
//INSERT INTO queries (category,item, user_id) VALUES ('food', 'Salad', 1),
const addNewItem = function(category, item, user_id = 1) {
  const values = [category, item, user_id];
  let queryString = `
  INSERT INTO queries(category,item, user_id)
  VALUES($1, $2, $3)
  RETURNING *`;

  return db.query(queryString, values)
    .then((data) => {
      const item = data.rows[0];
      return item;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
//modify the category to the already added item: edit the category or delete the item
const updateCategory = function(category, id) {
  const values = [category, id];
  const queryString = `
  UPDATE queries
  SET category = $1
  WHERE queries.id = $2
  RETURNING *`;

  return db.query(queryString, values)
    .then((data) => {
      const category = data.rows[0];
      return category;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

//delete an item from the list
const deleteAnItem = function(id) {
  console.log("id from db:", id);
  const values = [id];
  const queryString = `
  DELETE FROM queries
  WHERE id = $1
  RETURNING *`;

  return db.query(queryString, values)
    .then((data) => {
      //console.log("inside delete function", data);
      const item = data.rows[0];
      //console.log("inside function, item", item);
      return item;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { enlistItems, addNewItem, updateCategory, deleteAnItem };
