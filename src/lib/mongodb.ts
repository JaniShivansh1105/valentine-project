import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;