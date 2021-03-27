const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const router = require('./routes/routes');

const port = process.env.PORT || 4242;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Resolving CORS problems by accepting * as origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(router);

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found."
  })
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
