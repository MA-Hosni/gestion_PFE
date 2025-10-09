import express from 'express';
import logger from 'morgan';
import { PORT } from './src/shared/config/index.js';
import { connectDB } from './src/shared/db/db_config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('combined'));

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});