import type { PoolConnection } from "mysql2/promise";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Ship = {
  name: string;
  image: string;
  catchphrase: string;
  quantity: number;
  ship_available?: number;
};

class ShipRepository {
  // --------------------
  // Create ship
  // --------------------
  async create(ship: Omit<Ship, "id">) {
    try {
      const [result] = await databaseClient.query<Result>(
        "insert into ship (name, image, catchphrase, quantity) values (?, ?, ?, ?)",
        [ship.name, ship.image, ship.catchphrase, ship.quantity],
      );

      console.info(`Ship created with id ${result.insertId}`);

      return result.insertId;
    } catch (err) {
      console.error("Error creating ship:", err);
      throw err;
    }
  }

  // --------------------
  // Read single ship
  // --------------------
  async read(id: number) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "select * from ship where id = ?",
        [id],
      );

      return rows[0] as Ship | undefined;
    } catch (err) {
      console.error(`Error reading ship ${id}:`, err);
      throw err;
    }
  }

  // --------------------
  // Read all ships
  // --------------------
  async readAll() {
    try {
      const [rows] = await databaseClient.query<Rows>("select * from ship");

      console.info(`Fetched ${rows.length} ships`);

      return rows as Ship[];
    } catch (err) {
      console.error("Error reading ships:", err);
      throw err;
    }
  }

  // --------------------
  // Delete ship
  // --------------------
  async delete(id: number) {
    try {
      const [result] = await databaseClient.query<Result>(
        "delete from ship where id = ?",
        [id],
      );

      console.info(`Ship deleted: ${id}`);

      return result.affectedRows;
    } catch (err) {
      console.error(`Error deleting ship ${id}:`, err);
      throw err;
    }
  }

  // --------------------
  // Ship availability
  // --------------------
  async shipAvailable(id: number) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        `
        select ship.id, ship.quantity - COUNT(ship_id) as ship_available, ship.name
        from ship
        left join rent on ship_id = ship.id
        where ship.id = ?
        `,
        [id],
      );

      return rows[0] as Ship | undefined;
    } catch (err) {
      console.error(`Error checking ship availability for ${id}:`, err);
      throw err;
    }
  }

  // --------------------
  // Mark ship booked
  // --------------------
  async markAsBooked(id: number) {
    try {
      const [result] = await databaseClient.query<Result>(
        `
        UPDATE ship SET quantity = quantity - 1 
        WHERE id = ? AND quantity > 0
        `,
        [id],
      );

      console.info(`Ship booking attempted for id ${id}`);

      return result.affectedRows;
    } catch (err) {
      console.error(`Error booking ship ${id}:`, err);
      throw err;
    }
  }

  // --------------------
  // Atomic booking (transaction safe)
  // --------------------
  async bookShipAtomically(shipId: number, connection: PoolConnection) {
    try {
      const [rows] = await connection.query<Rows>(
        "SELECT quantity FROM ship WHERE id = ? FOR UPDATE",
        [shipId],
      );

      if (!rows[0] || rows[0].quantity <= 0) {
        console.info(`Ship ${shipId} unavailable`);
        return false;
      }

      await connection.query(
        "UPDATE ship SET quantity = quantity - 1 WHERE id = ?",
        [shipId],
      );

      console.info(`Ship ${shipId} successfully booked`);

      return true;
    } catch (err) {
      console.error(`Atomic booking failed for ship ${shipId}:`, err);
      throw err;
    }
  }
}

export default new ShipRepository();
