import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  hashed_password: string;
  is_admin: boolean;
};

type Rent = {
  id: number;
  user_id: number;
  ship_id: number;
  rent_time: Date;
};

class UserRepository {
  // --------------------
  // Create user
  // --------------------
  async create(user: Omit<User, "id" | "is_admin">) {
    try {
      const [result] = await databaseClient.query<Result>(
        "insert into user (email, firstname, lastname, hashed_password ) values (?, ?, ?, ?)",
        [user.email, user.firstname, user.lastname, user.hashed_password],
      );

      console.info(`User created with id ${result.insertId}`);

      return result.insertId;
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  // --------------------
  // Create rent
  // --------------------
  async createRent(shipId: number, userId: number) {
    try {
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO rent(user_id, ship_id) VALUES (?, ?)",
        [userId, shipId],
      );

      console.info(`Rent created: user ${userId} -> ship ${shipId}`);

      return result.insertId;
    } catch (err) {
      console.error("Error creating rent:", err);
      throw err;
    }
  }

  // --------------------
  // Read user by id
  // --------------------
  async read(id: number) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "select * from user where id = ?",
        [id],
      );

      return rows[0] as User | undefined;
    } catch (err) {
      console.error(`Error reading user ${id}:`, err);
      throw err;
    }
  }

  // --------------------
  // Read user by email
  // --------------------
  async readByEmail(email: string) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "select * from user where email = ?",
        [email],
      );

      return rows[0] as User | undefined;
    } catch (err) {
      console.error(`Error reading user by email ${email}:`, err);
      throw err;
    }
  }

  // --------------------
  // Read all users
  // --------------------
  async readAll() {
    try {
      const [rows] = await databaseClient.query<Rows>("select * from user");

      console.info(`Fetched ${rows.length} users`);

      return rows as User[];
    } catch (err) {
      console.error("Error reading users:", err);
      throw err;
    }
  }

  // --------------------
  // Read all rents
  // --------------------
  async readRent() {
    try {
      const [rows] = await databaseClient.query<Rows>("select * from rent");

      console.info(`Fetched ${rows.length} rents`);

      return rows as Rent[];
    } catch (err) {
      console.error("Error reading rents:", err);
      throw err;
    }
  }

  // --------------------
  // Read rents for a ship
  // --------------------
  async readRentSingle(shipId: number) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "select * from rent where ship_id = ?",
        [shipId],
      );

      return rows as Rent[];
    } catch (err) {
      console.error(`Error reading rents for ship ${shipId}:`, err);
      throw err;
    }
  }
}

export default new UserRepository();
