
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        mensagem: "Token não informado.",
      });
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return response.status(401).json({
        mensagem: "Token inválido.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não configurada.");
    }

    jwt.verify(token, secret);

    return next();
  } catch (error) {
    return response.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}
