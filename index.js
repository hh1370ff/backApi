import express from "express";
import dotenv from "dotenv";
import itemRouter from "./router/itemRouter.js";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";
import carouselRouter from "./router/carouselRouter.js";
import { connect } from "./config/connect.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import client from "./config/redis.js";

dotenv.config();
const app = express();
client.connect();

let port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/items", itemRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/carousel", carouselRouter);

app.listen(port, () => {
  connect(process.env.MONGO);
  console.log(`Server is running on port ${port}`);
});
