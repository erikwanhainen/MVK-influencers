const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const db = require("./queries");

/** Middleware */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**Just an intitial route with som info */
app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express, and Postgres API" });
});

/** Routes a HTTP get request with the specified path, locally example
 * http://localhost:3000/getMostAbsent?startdate=2019-01-01&enddate=2020-03-20
 * with the specified callback function */
app.get("/resultSAMostNeg", db.getSAResultMostNegative);
app.get("/resultSAMostPos", db.getSAResultMostPositive);
app.get("/getMostAbsent", db.getMostAbsent);
app.get("/getVotedAgainstPartiMode", db.getVotedAgainstPartiMode);
app.get("/getLedamot", db.getLedamot);
app.get("/getResultOverTime", db.getResultOverTime);
app.get("/getResultOverTimeParty", db.getResultOverTimeParty);
app.get("/getInfluence", db.getInfluence);

/** Start server an listen to port 3000 */
app.listen(3000, () => console.log("Webhook server is listening, port 3000"));
