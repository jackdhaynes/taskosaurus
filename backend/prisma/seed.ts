import { PrismaClient } from "@prisma/client";
import { toASCII } from "punycode";

const prisma = new PrismaClient();

async function main() {
  const devUser = await prisma.user.create({
    data: {
      id: 1,
    },
  });

  const tasks = await prisma.task.createMany({
    data: [
      {
        id: 1,
        userId: devUser.id,
        completed: false,
        active: true,
        dateCreated: new Date().toISOString(),
        description: "Release Taskosaurus",
      },
      {
        id: 2,
        userId: devUser.id,
        completed: true,
        active: false,
        dateCreated: new Date().toISOString(),
        description: "Create logo",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
