const express = require('express');
const router = express.Router();
const { apiCalls } = require('../lib/apicalls');
const { enlistItems, addNewItem, updateCategory, deleteAnItem } = require('./database');


module.exports = (db) => {
  //list of items
  router.get("/", (req, res) => {
    const categories = ['food', 'book', 'film', 'product', 'other'];
    let sortedList = [];
    for (let category of categories) {
      sortedList.push(enlistItems(category, user_id = 1));

    }
    Promise.all(sortedList)
      .then(data => {
        console.log("sorted list----", data);
        res.json(data);
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

   //add a new user
   router.get("/login", (req, res) => {
    const { name, email, password } = req.body;

    const values = [name, email, password];
    const queryString = `
    INSERT INTO queries(name, email, password)
    VALUES($1, $2, $3)
    RETURNING *`;
    db.query(queryString, [user_id])
      .then((data) => {
        const result = data.rows[0];
        res.json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  //get the queries with the given user_id
  router.get("/login/:id", (req, res) => {
    const user_id = req.params.id;
    console.log(user_id);
    const queryString = `
      SELECT * FROM queries WHERE user_id = $1;
      `;
    db.query(queryString, [user_id])
      .then((data) => {
        const result = data.rows;
        res.json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    //item or input from the client-side
    const item = req.body.item;
      apiCalls(item)
        .then((category) => {  //addNewItem = function(category, item, user_id)
          addNewItem(category, item, user_id);
          console.log("item added", category);
          res.json(category);
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: err.message });
        });
  });

  //update category of the item
  router.post("/update", (req, res) => {
    const category = req.body.category;
    const id = req.body.id;
    updateCategory(category, id)
      .then(
        res.status(200)
      )
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //delete the list
  router.post("/delete", (req, res) => {
    const id = req.body.id;
    deleteAnItem(id)
      .then((data) =>{
        res.json(data); //definitely needed
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
