import mongoose from 'mongoose';
import { MONGO_URI } from '../config/index.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to DB: ${conn.connection.host}`);
    } catch (err) {
        console.error(`DB connection error: ${err}`);
    }
};