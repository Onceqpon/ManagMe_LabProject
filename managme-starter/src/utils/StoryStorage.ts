import { Story } from "../types/Story";

export class StoryStorage {
    private static STORAGE_KEY = "stories";

    // Pobiera dane z localStorage i zwraca je jako tablicę Story, z obsługą błędów.
    private static safeGetData(): Story[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Błąd podczas odczytu danych z localStorage:", error);
            return [];
        }
    }

    static getAll(): Story[] {
        return this.safeGetData();
    }

    // Zwraca historie przypisane do konkretnego projektu
    static getByProject(projectId: string): Story[] {
        return this.getAll().filter((story) => story.projectId === projectId);
    }

    // Dodaje nową historię
    static add(story: Story): void {
        const stories = this.getAll();
        stories.push(story);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

    // Aktualizuje istniejącą historię
    static update(updateStory: Story): void {
        const stories = this.getAll();
        const updatedStories = stories.map((s) => (s.id === updateStory.id ? updateStory : s));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStories));
    }

    // Usuwa historię
    static delete(id: string): void {
        const stories = this.getAll().filter((s) => s.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }
}
