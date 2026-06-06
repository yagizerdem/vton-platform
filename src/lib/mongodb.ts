// lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const mongUriRegxp =
  /^mongodb(?:\+srv)?:\/\/(?:(?:[^:]+):(?:[^@]+)?@)?(?:(?:(?:[^ \/]+)|(?:\/.+\.sock?)),?)+(?:\/([^ \/\.\ "*<>:\|\\?]*))?(?:\?(?:(.+=.+)&?)+)*$/;

if (MONGODB_URI && !mongUriRegxp.test(MONGODB_URI)) {
  throw new Error("Please provide a valid MONGODB_URI");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
