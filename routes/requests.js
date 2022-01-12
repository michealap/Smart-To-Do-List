const express = require('express');
const router = express.Router();
const { apiCalls } = require('../lib/apicalls');
const { enlistItems, addNewItem, updateCategory, deleteAnItem } = require('./database');


module.exports = (db) => {
  //list of items
  router.get("/", (req, res) => {
    const user_id = 1; //hard-coded for a while-- should fetch id from req.params.id
    //console.log('user_id', user_id)
    const categories = ['food', 'book', 'film', 'product', 'other'];
    let sortedList = [];
    for (let category of categories) {
      sortedList.push(enlistItems(category, user_id));

    }
    Promise.all(sortedList)
      .then(data => {
        console.log("sorted list----", data)
        res.json(data);
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  //get the queries with the given user_id
  router.get("/:id", (req, res) => {
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
    const id = 1; //set to current db user 1
    console.log("req.body.item-----", item);
    console.log("id----", id);
    if (id) {
      //item to be added as a new item
      apiCalls(item)
        .then((category) => {  //const addNewItem = function(category, item, user_id)
          addNewItem(category, item, id);
          console.log("item added", category);
        })
        .then(() => {
          res.status(200);
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: err.message });
        });
    } else {
      res.status(403);
    }
  });

  //upadte category of the item
  router.post("/update", (req, res) => {
    const category = req.body.category;
    const id = req.body.id;
    updateCategory(category, id)
      .then(
        res.send(200)
      )
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

  //delete the list
  router.post("/delete", (req, res) => {
    const id = req.body.id;
    deleteAnItem(id)
      .then(
        res.send(200)
      );
  });
  
  return router;
};
