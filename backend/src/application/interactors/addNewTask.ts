import { addTask } from "@/infrastructure/database";
import { NewTask, Task } from "../types";

export const addNewTaskInteractor = (
  userId: number,
  description: string
): Promise<Task> => {
  const newTask: NewTask = {
    description: description,
    userId: userId,
    completed: false,
    active: true,
    dateCreated: new Date(),
  };

  return addTask(newTask);
};
