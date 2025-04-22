export type TaskState = "todo" | "in-progress" | "done";
export type TaskPriority = "niski" | "średni" | "wysoki";

// Interfejs reprezentujący użytkownika przypisanego do zadania
export interface AssignedUser {
  name: string;
  role: string;
}

// Interfejs reprezentujący zadanie
export interface Task {
  id: number;
  name: string;
  description: string;
  priority: TaskPriority;
  storyid: string;
  state: TaskState;
  startDate: string;
  workedHours: number;
  estimatedHours: number;
  assignedUser: AssignedUser; // Użycie interfejsu AssignedUser
}