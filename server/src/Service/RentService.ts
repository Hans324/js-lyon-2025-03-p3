import type { RentInput } from "../Entity/RentInput";
import rentRepository from "../modules/rent/rentRepository";

export default class RentService {
  async createRent(data: RentInput) {
    const { userId, shipId } = data;

    if (!userId || !shipId) {
      throw new Error("userId ou shipId manquant");
    }

    const insertId = await rentRepository.create(
      userId.toString(),
      shipId.toString(),
    );

    return { insertId, userId, shipId };
  }

  async getAllRents() {
    // si tu as une méthode readAll dans repo
    return await rentRepository.readAll?.();
  }
}
