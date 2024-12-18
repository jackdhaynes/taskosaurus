export type NewTask = {
  description: string;
  userId: number;
  completed: boolean;
  active: boolean;
  dateCreated: Date;
  dateDelete?: Date | undefined;
};

export type Task = NewTask & {
  id: number;
};

export type UserContext = {
  userId: number;
};
