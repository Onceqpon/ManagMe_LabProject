import { useState } from "react";
import { Task } from "../types/Task"; // Zakładając, że masz już model Task zdefiniowany

export const useTaskLogic = () => {
  // Zadania przechowywane w stanie aplikacji
  const [tasks, setTasks] = useState<Task[]>([]);

  // Funkcja tworzenia zadania (Create)
  const createTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Funkcja odczytu zadań (Read)
  const getAllTasks = (): Task[] => {
    return tasks;
  };

  // Funkcja aktualizacji zadania (Update)
  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Funkcja usuwania zadania (Delete)
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return {
    tasks: getAllTasks(),
    createTask,
    updateTask,
    deleteTask,
  };
};
