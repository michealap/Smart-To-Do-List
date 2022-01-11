const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryString = `
    SELECT * FROM queries;
    `
    db.query(queryString)
      .then(data => {
        res.json(data.rows)
      }).catch(err => {
        res.status(500).json({ error: err });
      });
    });

    //get the queries with the given user_id
    router.get("/:id", (req, res) => {
      const userId = req.params.id;
      console.log(userId);
      const queryString = `
      SELECT * FROM queries WHERE user_id = $1;`;
      db.query(queryString, [userId])
        .then((data)=>{
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
      const result = req.body;
      console.log(result)
      res.json({ result } )
    });

  return router;
};
