import { Task } from "../types/Task";  // Import typu Task

export class TaskStorage {
    private static STORAGE_KEY = "tasks";  // Klucz w localStorage do przechowywania zadań

    // Pobiera wszystkie zadania z localStorage
    static getAll(): Task[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Pobiera zadania przypisane do danej historyjki (storyid)
    static getByStory(storyId: string): Task[] {
        return this.getAll().filter((task) => task.storyid === storyId);
    }

    // Dodaje nowe zadanie do localStorage
    static add(task: Task): void {
        const tasks = this.getAll();
        tasks.push(task);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    // Aktualizuje istniejące zadanie w localStorage
    static update(updatedTask: Task): void {
        const tasks = this.getAll();
        const updatedTasks = tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTasks));
    }

    // Usuwa zadanie z localStorage
    static delete(id: number): void {
        const tasks = this.getAll().filter((task) => task.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
}
