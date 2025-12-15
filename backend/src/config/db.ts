import mongoose from "mongoose";

export default async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true } as const,
  };

  await mongoose.connect(uri, clientOptions);

  await mongoose.connection.db?.admin().command({ ping: 1 });
  console.log("Connected to MongoDB Atlas");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}
