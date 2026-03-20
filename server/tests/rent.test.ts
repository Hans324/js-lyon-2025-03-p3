import path from "node:path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Charger la config de test
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

let connection: mysql.Connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
});

afterAll(async () => {
  await connection.end();
});

// Rollback automatique pour garder la base propre
beforeEach(async () => {
  await connection.beginTransaction();
});

afterEach(async () => {
  await connection.rollback();
});

// ----------------------
// Test principal
// ----------------------
test("Un utilisateur peut louer un vaisseau", async () => {
  // Création utilisateur
  const [userResult] = await connection.execute<ResultSetHeader>(
    'INSERT INTO user (email, firstname, lastname, hashed_password) VALUES ("test@space.com", "Test", "Astronaut", "hash")',
  );
  const userId = userResult.insertId;

  // Création vaisseau
  const [shipResult] = await connection.execute<ResultSetHeader>(
    'INSERT INTO ship (name, quantity, catchphrase) VALUES ("TestShip", 1, "Exploring the galaxy")',
  );
  const shipId = shipResult.insertId;

  // Création location
  await connection.execute(
    "INSERT INTO rent (user_id, ship_id) VALUES (?, ?)",
    [userId, shipId],
  );

  // Vérification
  const [rows] = await connection.execute<RowDataPacket[]>(
    "SELECT * FROM rent WHERE user_id = ? AND ship_id = ?",
    [userId, shipId],
  );

  expect(rows.length).toBe(1);
});
