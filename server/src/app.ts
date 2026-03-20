import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import fs from "node:fs";
import path from "node:path";

import stripeRoutes from "./modules/stripe/stripeRoutes";
import stripeWebhook from "./modules/stripe/stripeWebhook";
import router from "./router";

const app = express();

/* ************************************************************************* */
/* Security middlewares */
/* ************************************************************************* */

app.use(helmet());
app.use(cookieParser());

/* ************************************************************************* */
/* Stripe webhook (must use raw body BEFORE express.json) */
/* ************************************************************************* */

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

/* ************************************************************************* */
/* CORS */
/* ************************************************************************* */

if (process.env.CLIENT_URL != null) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
}

/* ************************************************************************* */
/* Body parsing */
/* ************************************************************************* */

app.use(express.json());

/* ************************************************************************* */
/* Routes API et Stripe */
/* ************************************************************************* */

app.use(router); // ✅ Routes principales API
app.use(stripeRoutes); // ✅ Routes Stripe

/* ************************************************************************* */
/* Static files */
/* ************************************************************************* */

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const uploadFolderPath = path.join(__dirname, "../../server/upload");

if (fs.existsSync(uploadFolderPath)) {
  app.use("/upload", express.static(uploadFolderPath));
}

/* ************************************************************************* */
/* Front-end (DOIT ÊTRE EN DERNIER) */
/* ************************************************************************* */

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // ⚠️ Catch-all en dernier uniquement
  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* ************************************************************************* */
/* Error logging */
/* ************************************************************************* */

import type { ErrorRequestHandler } from "express";

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("Request:", req.method, req.path);
  next(err);
};

app.use(logErrors);

/* ************************************************************************* */

export default app;
