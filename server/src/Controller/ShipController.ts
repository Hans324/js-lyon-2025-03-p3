import type { Request, Response } from "express";
import ShipService from "../Service/ShipService";

const shipService = new ShipService();

export default class ShipController {
  async browse(req: Request, res: Response) {
    try {
      const ships = await shipService.getAllShips();
      console.log("All ships data: ", ships); // 👈 ajoute ça
      res.status(200).json(ships);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(500).json({ message });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const ship = await shipService.getShipById(Number(req.params.id));
      res.status(200).json(ship);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(400).json({ message });
    }
  }

  async checkAvailability(req: Request, res: Response) {
    try {
      const available = await shipService.checkAvailability(
        Number(req.params.id),
      );
      res.status(200).json(available);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(400).json({ message });
    }
  }

  async add(req: Request, res: Response) {
    try {
      const result = await shipService.addShip(req.body);
      res.status(201).json(result);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(400).json({ message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const result = await shipService.deleteShip(Number(req.params.id));
      res.status(200).json(result);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Erreur serveur";
      res.status(400).json({ message });
    }
  }
}
