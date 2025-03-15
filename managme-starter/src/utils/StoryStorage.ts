import{ Story } from "../types/Story";

export class StoryStorage {
    private static STORAGE_KEY = "stories";

    static getAll(): Story[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static getByProject(projectId: string): Story[] {
        return this.getAll().filter((story) => story.projectId === projectId);
    }

    static add(story: Story): void {
        const stories = this.getAll();
        stories.push(story);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

    static update(updateStory: Story): void {
        let stories = this.getAll();
        stories = stories.map((s) => (s.id === updateStory.id ? updateStory : s));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

    static delete(id: string): void {
        const stories = this.getAll().filter((s) => s.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

}