const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');


module.exports = {
    connectDB: async () => {
        await mongoose.connect(MONGO_URI)
                    .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`))
                    .catch((err) => console.error(`DB connection error: ${err}`));
    }
};