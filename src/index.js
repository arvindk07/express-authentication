import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import passport from "passport";

import userRouter from "./routes/users";
import postApis from "./routes/posts";

const app = express();

app.use(cors());
app.use(json());
app.use(passport.initialize());

import "./middlewares/passport";

app.use("/api/users", userRouter);
app.use("/api/posts", postApis);

const startApp = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB_CONNECTED");
    app.listen(5000, () =>
      console.log(`Server started listening on PORT ${PORT}`)
    );
  } catch (err) {
    console.log("UNABLE_TO_CONNECT_DB", err);
  }
};

export default startApp;
