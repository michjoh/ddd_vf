import { MongoClient } from "mongodb";

const Connection = () => MongoClient.connect(process.env.MONGODB_URI!, { bufferMaxEntries: 0, useNewUrlParser: true });

export const DatabaseConfig = async () => {
  const connection = await Connection();

  const db = connection.db();

  return { connection, db };
};
