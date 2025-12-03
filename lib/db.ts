
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
if (!uri) {
  console.warn("MONGODB_URI is not set – database calls will fail until configured.");
}

const client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _aunucloudClientPromise: Promise<MongoClient> | undefined;
}

if (!global._aunucloudClientPromise) {
  global._aunucloudClientPromise = client.connect();
}
clientPromise = global._aunucloudClientPromise;

export async function getDb() {
  const c = await clientPromise;
  return c.db(process.env.MONGODB_DB || "aunucloud");
}
