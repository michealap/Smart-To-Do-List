//We'll have to search these up afterwards
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');


const apiCalls = function(input) {
  //Get access to the api keys
  const rainforestApiKey = process.env.RAINFOREST_API_KEY;
  const omdbApiKey = process.env.OMDB_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  //Process the input/values
  const userInputLowerCase = input.toLowerCase();
  const userInput = valueConverter(input);
  const userInputSerialized = encodeURI(input);

  //Set starting category pass to false
  let pass = false;

  //Helper values for the rainforest API
  const params = {
  api_key: rainforestApiKey,
  type: "search",
  amazon_domain: "amazon.ca",
  search_term: userInput,
  page: "1"
  };

  //Helper function for input
  const valueConverter = function(input) {
  input = input.trim();
  let newInput = "";
  for (let i = 0; i < input.length; i++) {
    if (input[i] === ' ') {
      newInput += '+';
    } else {
      newInput += input[i];
    }
  }
  return newInput;
  };



  return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?location=49.2827,79.1207&radius=2500&keyword=${userInputSerialized}&type=cafe&key=${googleApiKey}`)
    .then(res => {
      if((res.data.status === "OK") && (res.data.results[0].types.includes('cafe') || res.data.results[0].name.toLowerCase() === userInputLowerCase)) {
        inputType = "food";
        pass = true;
      }

      console.log("Input is most liekly not a cafe");

    return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?location=49.2827,79.1207&radius=2500&keyword=${userInputSerialized}&type=restaurant&key=${googleApiKey}`)
    })
    .then(res => {
      if (pass) {
        return;
      }
      if((res.data.status === "OK") && (res.data.results[0].types.includes('restaurant') || res.data.results[0].name.toLowerCase() === userInputLowerCase)) {
          inputType = "food";
          pass = true;
      }

      console.log("Input is most liekly not a restaurant");

    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${userInputSerialized}&printType=books&key=${googleApiKey}`)
    })
    .then(res => {
      if (pass) {
        return;
      }
      if(res.data.totalItems !== 0 && ((res.data.items[0].volumeInfo.replace(/ /g, '').toLowerCase() === userInputLowerCase))) {
          inputType = "book";
          pass = true;
      }

      console.log("Input is most liekly not a book");

    return axios.get(`http://www.omdbapi.com/?t=${userInput}&apikey=${omdbApiKey}`);
      })
      .then(res => {
        if (pass) {
          return;
        }
        if((res.data.status === "OK") && (res.data.results[0].name.replace(/ /g, '').toLowerCase() === userInputLowerCase)) {
          inputType = "film";
          pass = true;
        }

        console.log("Input is most liekly not a film");

    return axios.get('https://api.rainforestapi.com/request', {params})
        .then(res => {
          if (inputType) {
            return inputType;
          }

          if (res.data.search[0].title.toLowerCase().includes(userInputLowerCase)) {
            inputType = "product";
          }
          console.log("Input is most liekly not a product");
          inputType = "unsorted";
          return inputType;
      })
      .catch(error => {
        console.log('error:', error.response.data, error.response.status);
        return 'error';
      })
  })
}

module.exports = {apiCalls};


http://www.omdbapi.com/?t=jaws&apikey=2e288a92

https://www.googleapis.com/books/v1/volumes?q=intitle:jaws&printType=books&key=AIzaSyBbhx8XATrO3bPG8-i1734tvVAdUzaqay4

spoonacular API-key: 7808b0b61fe44e1bb48e723c7fbaefac

https://api.spoonacular.com/food/ingredients/search

https://api.spoonacular.com/food/ingredients/search?query=${userInput}banana&number=2&sort=calories&sortDirection=desc&apiKey=${spoonApiKey}

return axios.get(`https://api.spoonacular.com/food/ingredients/search?query=${userInput}banana&number=2&sort=calories&sortDirection=desc&apiKey=${spoonApiKey}`);
    })
      .then(res => {
        if (pass) {
          return;
        }
        const spoonData = res.data.results;
        if (res.data.totalResults > 0) {
          for (let item in spoonData) {
            if (item.name.toLowerCase() === userInputLowerCase) {
              inputType = "Product"
              pass = true;
            }
          }
        }
