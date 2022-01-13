//We'll have to search these up afterwards
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');


const apiCalls = function(input) {
  let inputType = '';
  const rainforestApiKey = process.env.RAINFOREST_API_KEY;
  const omdbApiKey = process.env.OMDB_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const spoonApiKey = process.env.SPOON_API_KEY;
  //Reclassification helper
  const categories = ['the-film', 'the-restaurant', 'the-book', 'the-product', 'the-other'];
  const classifier = function(input) {
    const value = input.trim().split(" ");
    if (value[-1].includes(categories)) {
      if(value[-1].toLowerCase() === 'the-film') {
        return 'film';
      } else if (value[-1].toLowerCase() === 'the-restaurant') {
        return 'food';
      } else if (value[-1].toLowerCase() === 'the-book'){
        return 'book';
      } else if (value[-1].toLowerCase() === 'the-product') {
        return 'product';
      } else if (value[-1].toLowerCase() === 'the-other') {
        return 'other';
      }
    }
  }


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
  //Process the input/values
  const userInputLowerCase = input.toLowerCase();
  const userInput = valueConverter(input);
  const userInputSerialized = encodeURI(input);

  //Base classification
  classifier(input);

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


  return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.662905,-79.376897&radius=500&types=cafe&name=${userInput}&key=${googleApiKey}`)
    .then(res => {
      // console.log("Api returns this:", res.data);
      if ((res.data.status === "OK") && (res.data.results[0].types.includes('cafe') && res.data.results[0].name.toLowerCase() === userInputLowerCase)) {
        pass = true;
        console.log("Its a cafe!");
        inputType = "food";
        return inputType;
      } else {
        console.log("Input is most likely not a cafe");
      }

      return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.662905,-79.376897&radius=500&types=restaurant&name=${userInput}&key=${googleApiKey}`)
        .then(res => {
          if (pass) {
            return;
          }
          // console.log("this is res for the 2nd call:", res.data);
          if ((res.data.status === "OK") && (res.data.results[0].types.includes('restaurant') && res.data.results[0].name.toLowerCase() === userInputLowerCase)) {
            inputType = "food";
            pass = true;
            console.log("Its a restaurant!");
            return inputType;
          } else {
            console.log("Input is most likely not a restaurant");
          }
          return axios.get(`http://www.omdbapi.com/?t=${userInputLowerCase}&apikey=${omdbApiKey}`)
            .then(res => {
              if (pass) {
                return;
              }
              //console.log("omdb status:", res.data.status);
              if ((res.data.Response === 'True') && (res.data.Type === 'series' || res.data.Type === 'movie')) {
                pass = true;
                console.log("Its a film!");
                inputType = "film";
                return inputType;
              } else {
                console.log("Input is most likely not a film");
              }

              return axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${userInput}&printType=books&key=${googleApiKey}`)
                .then(res => {
                  if (pass) {
                    return;
                  }
                  console.log("this is the book api", res.data.kind);
                  if ((res.data.totalItems !== 0) && ((res.data.kind.split('#').includes('books')))) {
                    inputType = "book";
                    pass = true;
                    console.log("Its a book!");
                    return inputType;
                  } else {
                    console.log("Input is most likely not a book");
                  }
                  return axios.get(`https://api.spoonacular.com/food/ingredients/search?query=${userInput}&number=1&apiKey=${spoonApiKey}`)
                    .then(res => {
                      if (pass) {
                        return;
                      }
                      if (res.data.totalResults > 0 && res.data.results.name.toLowerCase() === userInputLowerCase) {
                        inputType = 'product';
                        return inputType;
                      } else {
                        console.log("Input is most likely not a product");
                        inputType = "other";
                        return inputType;
                      }
                    });
                });
            });
        })
        .catch(error => {
          console.log('error:', error.response.data, error.response.status);
          return 'error';
        });
    });
};

module.exports = {apiCalls};
