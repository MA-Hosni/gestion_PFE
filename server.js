import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { errorMiddleware } from './src/shared/middlewares/error.middleware.js';
import { PORT } from './src/shared/config/index.js';
import { connectDB } from './src/shared/db/db_config.js';
import authRouter from './src/modules/Authentication/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('combined'));
app.use(errorMiddleware);

await connectDB();

app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});