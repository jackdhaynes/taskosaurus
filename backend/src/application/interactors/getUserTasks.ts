import { getUserTasks } from "@/infrastructure/database";
import { Task } from "../types";

export const getUserTasksInteractor = (userId: number): Promise<Task[]> => {
  return getUserTasks(userId);
};
