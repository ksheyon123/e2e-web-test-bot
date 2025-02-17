import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { createScreenShotsDir } from "./utils/fs";
import { createModel, createPrompt, createChain } from "./utils/langchain";
import { ChatAnthropic } from "@langchain/anthropic";
import router from "./router/endpoint";
import api from "./router/api";
import reactRouter from "./router/react";

dotenv.config();

const app: Express = express();
const port: number = 8080;

createScreenShotsDir();

// Initialize LangChain model and chain
export let model: ChatAnthropic;

const initializeLangChain = async () => {
  try {
    model = createModel();
    console.log("LangChain model and chain initialized successfully");
  } catch (error) {
    console.error("Failed to initialize LangChain:", error);
    process.exit(1);
  }
};

initializeLangChain();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:8888",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static files
app.use(express.static("public"));

// Additional CORS headers for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8888");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Cache control
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

// Routes
app.use("/automate", router);
app.use("/api", api);
app.use("/", reactRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
