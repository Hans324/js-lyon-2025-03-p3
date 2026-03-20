import type { Request, Response } from "express";
import RentService from "../Service/RentService";

const rentService = new RentService();

export default class RentController {
  async add(req: Request, res: Response) {
    try {
      const result = await rentService.createRent(req.body);
      res.status(201).json(result);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(400).json({ message });
    }
  }

  async browse(req: Request, res: Response) {
    try {
      const rents = await rentService.getAllRents();
      res.status(200).json(rents);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(500).json({ message });
    }
  }
}
