const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = require('morgan');
app.use(logger('combined'));

const { PORT } = require('./src/shared/config');

const mongoose = require('mongoose');
const { connectDB } = require('./src/shared/db/db_config');
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});