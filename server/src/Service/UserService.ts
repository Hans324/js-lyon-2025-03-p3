import argon2 from "argon2";
import type { RentInput } from "../Entity/RentInput";
import type { UserInput } from "../Entity/UserInput";
import userRepository from "../modules/user/userRepository";
import { sanitizeUserInput } from "../utils/sanitize";

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

export default class UserService {
  async createUser(data: UserInput) {
    const firstname = sanitizeUserInput(data.firstname);
    const lastname = sanitizeUserInput(data.lastname);
    const email = sanitizeUserInput(data.email);

    if (!data.password || data.password.length < 8) {
      throw new Error("Mot de passe invalide");
    }

    const hashed_password = await argon2.hash(data.password, hashingOptions);

    const newUser = {
      firstname,
      lastname,
      email,
      hashed_password,
      is_admin: false,
    };

    const insertId = await userRepository.create(newUser);
    return { insertId, newUser };
  }

  async getAllUsers() {
    return await userRepository.readAll();
  }
  // Ajouter ici rentShip
  // ------------------------
  async rentShip(data: RentInput, authToken: string) {
    if (!authToken) throw new Error("Token manquant");

    if (!data.shipId) {
      throw new Error("Ship ID manquant");
    }

    // simulation simple
    return { message: "Location en cours..." };
  }
}
