import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected"),
    );
    mongoose.connection.on("error", (err) =>
      console.error("Database Connection Error:", err),
    );

    await mongoose.connect(`${process.env.DB_URL}/mern-auth`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
