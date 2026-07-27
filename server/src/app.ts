import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import router from "./router";
import stripeRoutes from "./modules/stripe/stripeRoutes";
import stripeWebhook from "./modules/stripe/stripeWebhook";

dotenv.config();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(cookieParser());

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

const devOrigins = new Set(
  [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ].filter((o): o is string => Boolean(o)),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (devOrigins.has(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(router);
app.use(stripeRoutes);

const uploadFolderPath = path.join(__dirname, "upload");

if (fs.existsSync(uploadFolderPath)) {
  app.use(
    "/upload",
    express.static(uploadFolderPath, {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );
}

const clientDistPath = path.join(__dirname, "dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

import type { ErrorRequestHandler } from "express";

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("Request:", req.method, req.path);
  next(err);
};

app.use(logErrors);

export default app;
