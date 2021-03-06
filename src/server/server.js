const express = require('express');

require('express-async-errors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('../routes/routes'));

app.use((error, request, response, next) => {
  console.log(error);
  response.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message
  });
  return next();
});

module.exports = app;
