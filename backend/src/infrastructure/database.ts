import { NewTask, Task } from "@/application/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addTask = async (task: NewTask): Promise<Task> => {
  const newTask = await prisma.task.create({ data: task });
  return newTask;
};

export const getUserTasks = async (userId: number): Promise<Task[]> => {
  return prisma.task.findMany({
    where: {
      id: userId,
    },
  });
};
