import type { Priority, Status } from './Story'; // Reużywamy istniejących typów

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  status: Status;
  estimatedTime: number; // w godzinach
  createdAt: string; // ISO Date
  startedAt: string | null;
  completedAt: string | null;
  assigneeId: string | null;
};