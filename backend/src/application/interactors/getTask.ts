import { getTask, getUserTasks } from "@/infrastructure/database";
import { Task, UserIdentity } from "../types";

export class TaskNotFoundError extends Error {}

export const getTaskInteractor = async (
  userIdentity: UserIdentity,
  taskId: number
): Promise<Task> => {
  const task = await getTask(taskId);

  if (task.userId != userIdentity.userId) {
    throw new TaskNotFoundError("Task not found");
  }

  return task;
};
