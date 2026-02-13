import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;