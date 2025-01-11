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
    console.log(MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
        console.log('Connected to database:', mongoose.connection.name);
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  console.log('Connected to MongoDB');
  return cached.conn;
}

export default dbConnect;
