import type {Request, Response, NextFunction} from "express";
import jwt from "./jwt.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme === "Bearer" && token && token.length > 0) {
    try {
      const {userId} = await jwt.verify(token);

      if (userId && userId.length > 0) {
        req.identity = userId;
      }
    } catch (e) {
      console.error("Failed to verify JWT", e);
    }
  }

  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.identity || req.identity.length === 0) {
    res.status(401).json({error: "Access denied"});
  } else {
    next();
  }
}