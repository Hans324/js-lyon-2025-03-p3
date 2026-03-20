import type { Request, Response } from "express";
import AuthService from "../Service/AuthService";

const authService = new AuthService();

export default class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      // Mettre le token dans le cookie
      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ user: result.user, message: "Login réussi" });
    } catch (err: unknown) {
      // ← Remplace "err: any" par "err: unknown"
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(401).json({ message });
    }
  }

  logout(req: Request, res: Response) {
    res
      .clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .status(200)
      .json({ message: "Déconnexion réussie" });
  }
}
