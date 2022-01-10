const express = require('express');
const router  = express.Router();
//wolfram api setup
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('VTY97J-53RUG8P66U');

module.exports = (db) => {
  router.get("/", (req, res) => {
    waApi.getFull({
      input: 'pikachu',
      includepodid: 'Statistics:PokemonData',
      format: 'plaintext'
      }).then((queryresult) => {
        console.log(queryresult.pods[0].subpods[0].plaintext)
      }).catch(console.error)
  });
  return router;
};
