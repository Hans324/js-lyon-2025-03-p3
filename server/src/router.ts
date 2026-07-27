import express from "express";

import { validateCreateUser } from "./middlewares/validation";
import verifyToken from "./middlewares/verifyToken";

import stripeWebhook from "./modules/stripe/stripeWebhook";

import AuthController from "./Controller/AuthController";
import RentController from "./Controller/RentController";
import ShipController from "./Controller/ShipController";
import UserController from "./Controller/UserController";

const router = express.Router();

/* ************************************************************************* */
/* Ship routes */
/* ************************************************************************* */

/* ************************************************************************* */
/* Auth routes */
/* ************************************************************************* */

/* ************************************************************************* */
/* User routes */
/* ************************************************************************* */

router.get("/api/me", verifyToken, (req, res) => {
  res.json(req.user);
});

/* ************************************************************************* */
/* Rent routes */
/* ************************************************************************* */

/* ************************************************************************* */
/* Stripe webhook */
/* ************************************************************************* */

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

const userController = new UserController();
const authController = new AuthController();

// 🌟 Routes User
router.get("/users", userController.browse.bind(userController));
router.post("/users", userController.add.bind(userController));

// 🌟 Routes Auth
router.post("/auth/login", authController.login.bind(authController));
router.post("/auth/logout", authController.logout.bind(authController));

// Routes Ship
const shipController = new ShipController();

router.get("/api/ships", shipController.browse.bind(shipController));
router.get("/api/ships/:id", shipController.read.bind(shipController));
router.get(
  "/api/ships/:id/availability",

  shipController.checkAvailability.bind(shipController),
);
router.post("/api/ships", verifyToken, shipController.add.bind(shipController));
router.delete(
  "/api/ships/:id",
  verifyToken,
  shipController.remove.bind(shipController),
);

/* RENT */
const rentController = new RentController();
router.post("/rents", verifyToken, rentController.add.bind(rentController));
router.get("/rents", verifyToken, rentController.browse.bind(rentController));

export default router;
