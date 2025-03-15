import { Project } from "../types/Project";

export class ProjectStorage {
    private static STORAGE_KEY = "projects";

    static getAll(): Project[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static getById(id: string): Project | undefined {
        return this.getAll().find((project) => project.id === id);
    }

    static add(project: Project): void {
        const projects = this.getAll();
        projects.push(project);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }

    static update(updateProject: Project): void {
        let projects = this.getAll();
        projects = projects.map((p) => (p.id === updateProject.id ? updateProject : p));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }

    static delete(id: string): void {
        const projects = this.getAll().filter((p) => p.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }
}
