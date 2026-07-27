import type { ShipInput } from "../Entity/ShipInput";
import shipRepository from "../modules/ship/shipRepository";
import { sanitizeUserInput } from "../utils/sanitize";

export default class ShipService {
  async getAllShips() {
    const ships = await shipRepository.readAll();
    console.log("All ships data:", ships); // log pour vérifier ce qui est renvoyé
    return ships;
  }

  async getShipById(id: number) {
    if (Number.isNaN(id)) throw new Error("ID de vaisseau invalide");
    const ship = await shipRepository.read(id);
    if (!ship) throw new Error("Vaisseau introuvable");
    return ship;
  }

  async checkAvailability(id: number) {
    if (Number.isNaN(id)) throw new Error("ID de vaisseau invalide");
    return await shipRepository.shipAvailable(id);
  }

  async addShip(data: ShipInput) {
    const newShip = {
      name: sanitizeUserInput(data.name),
      catchphrase: sanitizeUserInput(data.catchphrase),
      quantity: Number(data.quantity),
      image: data.image || "",
    };
    const insertId = await shipRepository.create(newShip);
    return { insertId, newShip };
  }

  async deleteShip(id: number) {
    if (Number.isNaN(id)) throw new Error("ID de vaisseau invalide");
    const result = await shipRepository.delete(id);
    return { result, id };
  }
}
