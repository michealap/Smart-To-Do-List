const express = require('express');
const router = express.Router();
const { apiCalls } = require('../lib/apiCalls');
const { enlistItems, addNewItem } = require('./database');


module.exports = (db) => {
  //list of items
  router.get("/", (req, res) => {
    const user_id = req.params.id;
    const categories = ['restaurants', 'books', 'films', 'products', 'others']
    let sortedList = [];
    for(let category of categories){
      sortedList.push(enlistItems(category, user_id));
    }
    Promise.all(sortedList)
      .then(data => {
        res.json(data)
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  //get the queries with the given user_id
  router.get("/:id", (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    const queryString = `
      SELECT * FROM queries WHERE user_id = $1;
      `;
    db.query(queryString, [userId])
      .then((data) => {
        const result = data.rows
        res.json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      })
  })

  router.post("/", (req, res) => {
    //item or input from the client-side
    const item = req.body.item;
    const id = req.params.id;
    if (id) {
      //item to be added as a new item
      apiCalls(item)
        .then((category) => {  //const addNewItem = function(category, item, user_id)
          addNewItem(category, item, id)
        })
        .then(() => {
          res.send(200);
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




return router;
};
