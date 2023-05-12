import express from "express";
import "express-async-errors";
import compression from "compression";
import path from "path";
import router from "./router";
const app = express();
const basicAuth = require("express-basic-auth")

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(compression());

app.use("/",basicAuth({ users: { 'user': process.env.PASSWORD }, challenge: true }), router);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('error')
});

export { app };