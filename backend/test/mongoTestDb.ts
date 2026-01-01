import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export async function connectTestDb() {
  mongoServer = await MongoMemoryServer.create();
  const uri = `${mongoServer.getUri()}reptracker_test`;

  await mongoose.connect(uri);
}

export async function clearTestDb() {
  const { connection } = mongoose;
  if (!connection?.db) return;

  const collections = await connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

export async function disconnectTestDb() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}
