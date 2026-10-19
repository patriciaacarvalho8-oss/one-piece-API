
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";

export default {
  login: async (request: Request, response: Response) => {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        return response.status(400).json({
          mensagem: "Informe o email e a senha.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return response.status(401).json({
          mensagem: "Email ou senha inválidos.",
        });
      }

      const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaValida) {
        return response.status(401).json({
          mensagem: "Email ou senha inválidos.",
        });
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET não configurada.");
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        secret,
        { expiresIn: "1d" }
      );

      return response.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        mensagem: "Erro interno ao realizar login.",
      });
    }
  },
};
