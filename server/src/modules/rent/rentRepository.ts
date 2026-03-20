import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

class RentRepository {
  // --------------------
  // Create rent (standard)
  // --------------------
  async create(userID: string, shipID: string) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO rent (user_id, ship_id) values (?, ?)",
      [userID, shipID],
    );

    return result.insertId;
  }

  // --------------------
  // Create rent (transaction safe)
  // --------------------
  async createRentTransaction(
    userId: number,
    shipId: number,
    connection: PoolConnection,
  ): Promise<number> {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO rent (user_id, ship_id) VALUES (?, ?)",
      [userId, shipId],
    );

    return result.insertId;
  }

  // --------------------
  // Read all rents (optionnel mais utile)
  // --------------------
  async readAll() {
    const [rows] = await databaseClient.query("SELECT * FROM rent");
    return rows;
  }
}

export default new RentRepository();
