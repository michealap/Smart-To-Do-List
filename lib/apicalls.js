//We'll have to search these up afterwards
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');


const apiCalls = function(input) {
  //Get access to the api keys
  const rainforestApiKey = process.env.GOOGLE_API_KEY;
  const omdbApiKey = process.env.OMDB_API_KEY;
  const googleApiKey = process.env.RAINFOREST_API_KEY;

  //Process the input/values
  const userInputLowerCase = input.toLowerCase();
  const userInput = valueConverter(input);
  const userInputSerialized = encodeURI(input);

  //Helper values for the rainforest API
  const params = {
  api_key: rainforestApiKey,
  type: "search",
  amazon_domain: "amazon.ca",
  search_term: userInput,
  category_id: 'bestsellers_grocery',
  page: "1"
  };

  //Set starting category pass to false
  let pass = false;

  //Helper function for input
  const valueConverter = function(input) {
  input.trim();
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
      if((res.data.status === "OK") && (res.data.results[0].types.includes('cafe') || res.data.results[0].name === userInput)) {
        inputType = "food";
        pass = true;
        console.log("Its a cafe!");
      }

      console.log("Input is most liekly not a cafe");

    return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?location=49.2827,79.1207&radius=2500&keyword=${userInputSerialized}&type=restaurant&key=${googleApiKey}`)
    })
    .then(res => {
      if (pass) {
        return;
      }
      if((res.data.status === "OK") && (res.data.results[0].types.includes('restaurant') || res.data.results[0].name === userInput)) {
          inputType = "food";
          pass = true;
          console.log("Its a restaurant!");
      }

      console.log("Input is most liekly not a restaurant");

    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${userInputSerialized}&printType=books&key=${googleApiKey}`)
    })
    .then(res => {
      if (pass) {
        return;
      }
      if(res.data.totalItems !== 0 && ((res.data.kind.split('#').includes('books')))) {
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
        if((res.data.status === "OK") && (res.data.Response === 'True' || (res.data.Type === 'series' || res.data.Type === 'movie'))) {
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
