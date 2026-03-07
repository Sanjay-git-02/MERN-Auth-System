import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDatabase from "./config/db.js"
import authRouter from "./database/routes/authRoutes.js";
import userRouter from "./database/routes/userRoutes.js";

const app = express();
connectDatabase();
const PORT = process.env.PORT;

const allowOrigins = ["http://localhost:5173","http://localhost:5174"]

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:allowOrigins,credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter)
app.get("/", (req, res) => res.send("API working"));


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
