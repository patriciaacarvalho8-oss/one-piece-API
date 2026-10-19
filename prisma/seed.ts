
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

async function main() {
  const senhaHash = await bcrypt.hash("luffy123", 10);

  await prisma.usuario.upsert({
    where: {
      email: "admin@onepiece.com",
    },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@onepiece.com",
      senha: senhaHash,
    },
  });

  console.log("Usuário criado com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
