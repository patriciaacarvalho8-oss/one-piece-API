
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {

  list: async (request: Request, response: Response) => {
    try {
      const personagens = await prisma.personagem.findMany();

      return response.status(200).json(personagens);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  getById: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const personagem = await prisma.personagem.findUnique({
        where: { id: Number(id) },
      });

      if (!personagem) {
        return response.status(404).json({
          mensagem: "Personagem não encontrado.",
        });
      }

      return response.status(200).json(personagem);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  create: async (request: Request, response: Response) => {
    try {
      const { nome, fruta, recompensa, tripulacao, cargo } = request.body;

      if (!nome || !recompensa || !tripulacao || !cargo) {
        return response.status(400).json({
          mensagem: "Preencha nome, recompensa, tripulação e cargo.",
        });
      }

      const personagem = await prisma.personagem.create({
        data: {
          nome,
          fruta: fruta || null,
          recompensa,
          tripulacao,
          cargo,
        },
      });

      return response.status(201).json(personagem);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const id = Number(request.params.id);
      const { nome, fruta, recompensa, tripulacao, cargo } = request.body;

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          mensagem: "ID inválido.",
        });
      }

      const personagem = await prisma.personagem.update({
        where: { id },
        data: {
          ...(nome !== undefined && { nome }),
          ...(fruta !== undefined && { fruta }),
          ...(recompensa !== undefined && { recompensa }),
          ...(tripulacao !== undefined && { tripulacao }),
          ...(cargo !== undefined && { cargo }),
        },
      });

      return response.status(200).json(personagem);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  // Excluir personagem
  delete: async (request: Request, response: Response) => {
    try {
      const id = Number(request.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          mensagem: "ID inválido.",
        });
      }

      await prisma.personagem.delete({
        where: { id },
      });

      return response.status(200).json({
        mensagem: "Personagem excluído com sucesso.",
      });
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};
