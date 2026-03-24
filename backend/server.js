import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import errorMiddleware from './src/shared/middlewares/error.middleware.js';
import { CORS_ORIGIN, PORT } from './src/shared/config/index.js';
import { connectDB } from './src/shared/db/db_config.js';
import authRouter from './src/modules/Authentication/index.js';
import teamARouter from './src/modules/Team_A/index.js';
import teamBRouter from './src/modules/Team_B/index.js';
import teamCRouter from './src/modules/Team_C/index.js';
import teamDRouter from './src/modules/Team_D/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/shared/config/swagger.js';

const app = express();

const allowedOrigins = (CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (no Origin header) and explicitly allowed origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('combined'));

await connectDB();

// Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'PFE Management API Docs',
}));

app.use('/api', authRouter);
app.use('/api', teamARouter);
app.use('/api', teamBRouter);
app.use('/api', teamCRouter);
app.use('/api', teamDRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});