const axios = require("axios");

require("dotenv").config();

axios
  .get(`https://finnhub.io/api/v1/covid19/us?token=${process.env.TOKEN}`)
  .then(({ data: states }) => {
    let filteredData = states.filter(({ state }) => {
      return state.toUpperCase() == "NEW YORK";
    });
    console.log(...filteredData);
  })
  .catch((err) => console.log(err));
