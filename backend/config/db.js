const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // In development, gracefully fallback to an in-memory database if local MongoDB is not running
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('Attempting to connect to local MongoDB...');
        // Set a short timeout so it doesn't hang if Mongo is not running
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('Local MongoDB not found. Starting In-Memory MongoDB Server...');
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      }
    } else {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
