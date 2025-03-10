import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/DB/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from frontend
  credentials: true, // Allow cookies/auth headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
import productRouter from "./src/routes/productRouter.js";
import customerRouter from "./src/routes/customerRouter.js";
import vendorRouter from "./src/routes/vendorRouter.js";
import stockInRouter from "./src/routes/stockInRouter.js";
import fileuploadrouter from "./src/routes/fileUploadRouter.js";
import authRouter from "./src/routes/authRouter.js";

// Middleware
import authTokenVerifyMiddleware from "./src/middlewares/authTokenVerifyMiddleware.js";

// MongoDB Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Stockipy API");
});

//middleware
app.use(authTokenVerifyMiddleware);

//for auth routing
app.use("/api", authRouter);
app.post("/v1/auth/signup", authRouter);
app.post("/v1/auth/login", authRouter);
app.post("/v1/auth/regenerate-access-token", authRouter);
app.put("/v1/auth/logout/:id", authRouter);

//for products routing
app.use("/api", productRouter);
app.get("/v1/products", productRouter);
app.get("/v1/products/:id", productRouter);
app.post("/v1/products", productRouter);
app.put("/v1/products/:id", productRouter);
app.delete("/v1/products/:id", productRouter);

//vendor routing
app.use("/api", vendorRouter);
app.get("/v1/vendors", vendorRouter);
app.get("/v1/vendors/:id", vendorRouter);
app.post("/v1/vendors", vendorRouter);
app.put("/v1/vendors/:id", vendorRouter);
app.delete("/v1/vendors/:id", vendorRouter);

//customer routing
app.use("/api", customerRouter);
app.get("/v1/customers", customerRouter);
app.get("/v1/customers/:id", customerRouter);
app.post("/v1/customers", customerRouter);
app.put("/v1/customers/:id", customerRouter);
app.delete("/v1/customers/:id", customerRouter);

//stock In routing
app.use("/api", stockInRouter);
app.get("/v1/stock-ins", stockInRouter);
app.get("/v1/stock-ins/:id", stockInRouter);
app.post("/v1/stock-ins", stockInRouter);
app.put("/v1/stock-ins/:id", stockInRouter);
app.delete("/v1/stock-ins/:id", stockInRouter);
//stock-in file upload
app.use("/api", fileuploadrouter);
app.post("/v1/file", fileuploadrouter);
app.delete("/v1/file/:public_id", fileuploadrouter);


// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
