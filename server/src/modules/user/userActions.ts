// src/modules/user/userActions.ts
import argon2 from "argon2";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { PoolConnection } from "mysql2/promise";
import databaseClient from "../../../database/client";
import { sanitizeUserInput } from "../../utils/sanitize";
import rentRepository from "../rent/rentRepository";
import shipRepository from "../ship/shipRepository";
import userRepository from "./userRepository";

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10, // 19 Mio en kio
  timeCost: 2,
  parallelism: 1,
};

// --------------------
// Middleware hashPassword
// --------------------
const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Le mot de passe est requis" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères",
      });
    }

    const hashedPassword = await argon2.hash(password, hashingOptions);
    req.body.hashed_password = hashedPassword;
    req.body.password = undefined;

    next();
  } catch (err) {
    console.error("Erreur lors du hashage du mot de passe:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Browse all users
// --------------------
const browse: RequestHandler = async (req, res) => {
  try {
    const users = await userRepository.readAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Browse all rents
// --------------------
const browseRent: RequestHandler = async (req, res) => {
  try {
    const rents = await userRepository.readRent();
    res.status(200).json(rents);
  } catch (err) {
    console.error("Erreur lors de la récupération des locations:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Read single user
// --------------------
const read: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const payload = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as JwtPayload;
    const userId = Number(payload.sub);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const user = await userRepository.read(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({
      message: "Infos utilisateur",
      user: {
        isAdmin: user.is_admin,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la lecture de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Read rents for a single ship
// --------------------
const readRent: RequestHandler = async (req, res) => {
  try {
    const shipId = Number(req.params.id);
    if (Number.isNaN(shipId)) {
      return res.status(400).json({ message: "ID de vaisseau invalide" });
    }

    const ship = await userRepository.read(shipId);
    if (!ship) return res.status(404).json({ message: "Vaisseau non trouvé" });

    const rentCount = await userRepository.readRentSingle(shipId);
    res.status(200).json(rentCount);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des locations du vaisseau:",
      err,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Add new user
// --------------------
const add: RequestHandler = async (req, res) => {
  try {
    const firstname = sanitizeUserInput(req.body.firstname);
    const lastname = sanitizeUserInput(req.body.lastname);
    const email = sanitizeUserInput(req.body.email);

    const newUser = {
      firstname,
      lastname,
      email,
      hashed_password: req.body.hashed_password,
      is_admin: false,
    };

    const insertId = await userRepository.create(newUser);

    res.status(201).json({ insertId, newUser });
  } catch (err) {
    console.error("Erreur lors de l'ajout d'un utilisateur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Rent a ship (transactionnel & sécurisé)
// --------------------
const rentShip: RequestHandler = async (req, res) => {
  let connection: PoolConnection | undefined;

  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const payload = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as JwtPayload;
    const userId = Number(payload.sub);
    const shipId = Number(req.body.shipId);

    if (Number.isNaN(userId) || Number.isNaN(shipId)) {
      return res.status(400).json({ message: "Paramètres invalides" });
    }

    connection = await databaseClient.getConnection();
    await connection.beginTransaction();

    const booked = await shipRepository.bookShipAtomically(shipId, connection);
    if (!booked) {
      await connection.rollback();
      return res.status(400).json({ error: "Vaisseau indisponible" });
    }

    const rentId = await rentRepository.createRentTransaction(
      userId,
      shipId,
      connection,
    );

    await connection.commit();
    res.status(201).json({ message: "Réservation confirmée", rentId });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Erreur lors de la réservation:", err);
    res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (connection) connection.release();
  }
};

// --------------------
// Export
// --------------------
export default {
  hashPassword,
  browse,
  read,
  add,
  rentShip,
  browseRent,
  readRent,
};
