import argon2 from "argon2";
import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository"; // chemin relatif correct

const login: RequestHandler = async (req, res, next) => {
  try {
    // 1️⃣ Lecture utilisateur
    const user = await userRepository.readByEmail(req.body.email);
    if (!user) {
      console.info("Login failed: user not found", { email: req.body.email });
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // 2️⃣ Vérification mot de passe
    const verified = await argon2.verify(
      user.hashed_password,
      req.body.password,
    );
    if (!verified) {
      console.info("Login failed: password mismatch", {
        email: req.body.email,
      });
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // 3️⃣ Création JWT
    if (!process.env.APP_SECRET) {
      console.error("JWT secret not defined");
      return res.status(500).json({ message: "Erreur serveur" });
    }

    const { hashed_password, ...userWithoutHashedPassword } = user;

    const payload: JwtPayload = {
      sub: user.id.toString(),
      isAdmin: user.is_admin,
    };
    const token = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "1h",
    });

    // 4️⃣ Cookie HTTP sécurisé
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 5️⃣ Réponse succès
    console.info(`Login successful: ${user.email}`);
    res
      .status(200)
      .json({ user: userWithoutHashedPassword, message: "Login réussi" });
  } catch (err) {
    // 6️⃣ Exception imprévisible
    console.error("Unexpected login error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const logout: RequestHandler = (req, res) => {
  res
    .clearCookie("auth_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    .clearCookie("email", { httpOnly: true, sameSite: "strict", secure: true })
    .status(200)
    .json({ message: "Déconnexion réussie" });
};

export default { login, logout };
