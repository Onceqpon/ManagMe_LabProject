import { useState, useEffect } from "react";
import { TaskState, Task } from "../types/Task";
import { TaskStorage } from "../utils/TaskStorage"; // Import klasy TaskStorage
import { useParams } from "react-router-dom";

export const useTaskLogic = (activeHistory: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { taskId } = useParams<{ taskId: string }>(); // Pobierz taskId z parametrów URL

  // Załaduj zadania przypisane do aktywnej historyjki
  useEffect(() => {
    if (activeHistory) {
      setTasks(TaskStorage.getByStory(activeHistory)); // Pobieramy zadania przypisane do aktywnej historyjki
    }
  }, [activeHistory]);

  // Załaduj pojedyncze zadanie po taskId (jeśli taskId jest dostępne)
  useEffect(() => {
    if (taskId) {
      const taskData = TaskStorage.getAll().find((t) => t.id === parseInt(taskId)); // Pobierz zadanie po id
      if (taskData) {
        setTasks([taskData]); // Ustawiamy pojedyncze zadanie jako element tablicy
      }
    }
  }, [taskId]);

  // Dodaj nowe zadanie
  const handleAddTask = (newTask: Task) => {
    if (!activeHistory) return;

    newTask.storyid = activeHistory;  // Powiąż zadanie z aktywną historyjką
    TaskStorage.add(newTask);
    setTasks(TaskStorage.getByStory(activeHistory)); // Odśwież zadania
  };

  // Zaktualizuj istniejące zadanie
  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  // Usuń zadanie
  const handleDeleteTask = (taskId: number) => {
    if (!activeHistory) return;

    TaskStorage.delete(taskId);
    setTasks(TaskStorage.getByStory(activeHistory)); // Odśwież zadania
  };

  // Filtrowanie zadań po stanie
  const filterTasksByState = (state: TaskState) =>
    tasks.filter((task) => task.state === state);

  const handleAssignUser = (taskId: number, role: "devops" | "developer") => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const assignedUser = {
          name: role === "devops" ? "John Doe" : "Jane Smith", // Imiona dla ról
          role: role,
        };
        return { ...task, assignedUser };
      }
      return task;
    });
    setTasks(updatedTasks);
  };


  // Funkcja zmiany stanu zadania
  const handleChangeTaskState = (taskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        let newState: TaskState;
        switch (task.state) {
          case "todo":
            newState = "in-progress";
            break;
          case "in-progress":
            newState = "done";
            break;
          case "done":
          default:
            newState = "todo";
            break;
        }
        return { ...task, state: newState };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return {
    tasks,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    filterTasksByState,
    handleAssignUser,
    handleChangeTaskState,
  };
};
