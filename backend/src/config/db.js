const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };

  await mongoose.connect(uri, clientOptions);

  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Connected to MongoDB Atlas (ping ok)");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}

module.exports = connectDB;
