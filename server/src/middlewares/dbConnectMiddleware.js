// src/middlewares/dbConnectMiddleware.js
import connectDB from "../DB/index.js";

async function dbConnectMiddleware(req, res, next) {
  await connectDB();
  next();
}

export default dbConnectMiddleware;
