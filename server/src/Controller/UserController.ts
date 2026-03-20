// src/Controller/UserController.ts
import type { Request, Response } from "express";
import UserService from "../Service/UserService";

const userService = new UserService();

export default class UserController {
  async browse(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      const safeUsers = users.map((user) => {
        const { hashed_password, ...safeUser } = user;
        return safeUser;
      });

      res.status(200).json(safeUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
  async add(req: Request, res: Response) {
    try {
      console.log("USER CONTROLLER HIT");
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async rentShip(req: Request, res: Response) {
    try {
      const rentInfo = await userService.rentShip(
        req.body,
        req.cookies.auth_token,
      );
      res.status(201).json(rentInfo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Ajouter d’autres méthodes : read, browseRent, readRent
}
