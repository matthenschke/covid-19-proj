const http = require("http");
const express = require("express");
const app = express();
const axios = require("axios");

require("dotenv").config();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.post("/sms", (req, res) => {
  const {
    body: { Body },
  } = req;
  axios
    .get(`https://finnhub.io/api/v1/covid19/us?token=${process.env.TOKEN}`)
    .then(({ data: states }) => {
      let msg;
      let result = {
        ...states.filter(({ state }) => {
          return state.toUpperCase() == Body.toUpperCase();
        })[0],
      };
      if (Object.keys(result).length === 0) {
        msg =
          "Could not retrieve data at this time, try entering another u.s. state";
      } else {
        msg = `Cases: ${result.case} \n Deaths: ${
          result.death
        } \n Updated : ${new Date(result.updated).toString()}`;
      }

      const twiml = new MessagingResponse();
      twiml.message(msg);

      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    })
    .catch((err) => console.log(err));
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
