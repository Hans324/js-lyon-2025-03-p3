import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token;

  if (!token) {
    console.warn("Authentication failed: missing token");
    res.status(401).json({ message: "Token manquant" });
    return;
  }

  const secret = process.env.APP_SECRET;

  if (!secret) {
    console.error("APP_SECRET is not defined in environment variables");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;

    console.info(`Token verified for user ${decoded.sub}`);

    next();
  } catch (err) {
    console.warn("Invalid or expired token");
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

export default verifyToken;
