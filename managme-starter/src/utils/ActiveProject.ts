export class ActiveProject {
    private static STORAGE_KEY = "activeProject";

    static setActive(projectId: string) {
        localStorage.setItem(this.STORAGE_KEY, projectId);
    }

    static getActive(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    }
}