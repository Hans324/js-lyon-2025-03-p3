import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { LoginInput } from "../Entity/LoginInput";
import userRepository from "../modules/user/userRepository";

export default class AuthService {
  async login(data: LoginInput) {
    // 1 Lecture utilisateur
    const user = await userRepository.readByEmail(data.email);
    if (!user) throw new Error("Email ou mot de passe incorrect");

    // 2 Vérification mot de passe
    const verified = await argon2.verify(user.hashed_password, data.password);
    if (!verified) throw new Error("Email ou mot de passe incorrect");

    if (!process.env.APP_SECRET) throw new Error("JWT secret non défini");

    const { hashed_password, ...userWithoutHashedPassword } = user;

    // 3️ Création JWT
    const payload = {
      sub: user.id.toString(),
      isAdmin: user.is_admin,
    };
    const token = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "1h",
    });

    return { token, user: userWithoutHashedPassword };
  }

  logout() {
    // Pas besoin de DB, le Controller gère les cookies
    return true;
  }
}
