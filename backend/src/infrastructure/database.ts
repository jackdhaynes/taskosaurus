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

class TaskNotFoundError extends Error {}

export const getTask = async (taskId: number): Promise<Task> => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new TaskNotFoundError("Task not found");
  }

  return task;
};
