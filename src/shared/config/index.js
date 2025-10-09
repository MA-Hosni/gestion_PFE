import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
export const JWT_SIGNUP_EXPIRES_IN = process.env.JWT_SIGNUP_EXPIRES_IN;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;