require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sanitizer = require('./app/middlewares/body-sanitizer');
const multer  = require('multer');

const app = express();

const router = require('./app/router');

const port = process.env.PORT || 3000;

const bodyParser = multer();
app.use( bodyParser.none() );
app.use(sanitizer);

app.use(express.static('assets'));

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});