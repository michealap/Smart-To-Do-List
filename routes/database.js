const { Pool } = require("pg");

const poolArray = [];
const booksArray = [];
const filmArray = [];
const restaurantArray = [];
const productsArray = [];
const otherArray = [];
pool.query(`
SELECT widgets.category AS category, widgets.item AS item
FROM users
JOIN lists ON lists.user_id = users.id
JOIN widgets ON widgets.id = lists.query_id
WHERE users.id= ${users.id}`)
.then(res => {
  res.rows.forEach(query => {
    if(widgets.category === 'books') {
      booksArray.push(query);
    } else if (widgets.category === 'film') {
      filmArray.push(query);
    } else if (widgets.category === 'restaurant') {
      restaurantArray.push(query);
    } else if (widgets.category === 'products') {
      productsArray.push(query);
    } else {
      otherArray.push(query);
    }
  });
})
