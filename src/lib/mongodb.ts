import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {};

let clientPromise: Promise<MongoClient>;

if (uri) {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  // Dummy promise so build doesn't crash if env is missing
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is missing")
  );
}

export default clientPromise;