import path from "node:path";
import type { RequestHandler } from "express";
import multer from "multer";
import { sanitizeUserInput } from "../../utils/sanitize";
import shipRepository from "./shipRepository";

// --------------------
// Browse ships
// --------------------
const browse: RequestHandler = async (req, res) => {
  try {
    const ships = await shipRepository.readAll();
    console.info("Ships fetched successfully");

    res.status(200).json(ships);
  } catch (err) {
    console.error("Error fetching ships:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Read single ship
// --------------------
const read: RequestHandler = async (req, res) => {
  try {
    const shipId = Number(req.params.id);

    if (Number.isNaN(shipId)) {
      return res.status(400).json({ message: "ID de vaisseau invalide" });
    }

    const ship = await shipRepository.read(shipId);

    if (!ship) {
      console.info(`Ship not found: ${shipId}`);
      return res.status(404).json({ message: "Vaisseau introuvable" });
    }

    console.info(`Ship fetched: ${shipId}`);
    res.status(200).json(ship);
  } catch (err) {
    console.error("Error reading ship:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Ship availability
// --------------------
const shipAvailable: RequestHandler = async (req, res) => {
  try {
    const shipId = Number(req.params.id);

    if (Number.isNaN(shipId)) {
      return res.status(400).json({ message: "ID de vaisseau invalide" });
    }

    const ship = await shipRepository.shipAvailable(shipId);

    console.info(`Availability checked for ship ${shipId}`);

    res.status(200).json(ship);
  } catch (err) {
    console.error("Error checking ship availability:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Multer configuration
// --------------------
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../../upload"),
  filename: (_req, _file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 10)}.jpg`;
    callback(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Seules les images sont autorisées"));
    }
    callback(null, true);
  },
});

// --------------------
// Add ship
// --------------------
// --------------------
// Add ship (image optionnelle)
// --------------------
const add: RequestHandler = async (req, res) => {
  try {
    // ✅ Récupère le fichier s’il existe, sinon null
    const imageFile = req.file ? `/upload/${req.file.filename}` : "";

    // Crée l’objet du nouveau vaisseau
    const newShip = {
      name: sanitizeUserInput(req.body.name),
      catchphrase: sanitizeUserInput(req.body.catchphrase),
      quantity: Number(req.body.quantity),
      image: imageFile,
    };

    const insertId = await shipRepository.create(newShip);

    console.info(`Ship created with id ${insertId}`);
    res.status(201).json({ insertId, newShip });
  } catch (err) {
    console.error("Error creating ship:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --------------------
// Delete ship
// --------------------
const remove: RequestHandler = async (req, res) => {
  try {
    const shipId = Number(req.params.id);

    if (Number.isNaN(shipId)) {
      return res.status(400).json({ message: "ID de vaisseau invalide" });
    }

    const result = await shipRepository.delete(shipId);

    console.info(`Ship deleted: ${shipId}`);

    res.status(200).json({ result, shipId });
  } catch (err) {
    console.error("Error deleting ship:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { browse, read, add, remove, shipAvailable };
