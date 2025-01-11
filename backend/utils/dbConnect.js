import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new connection');
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => {
        console.log('Connected to database:', mongoose.connection.name);
        return mongoose;
      }).catch((error) => {
        console.error('Error connecting to database:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  console.log('Connected to MongoDB');
  return cached.conn;
}

export default dbConnect;
