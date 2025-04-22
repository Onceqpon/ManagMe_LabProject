export class ActiveHistory {
    private static STORAGE_KEY = "activeHistory";

    static setActive(historyId: string) {
        localStorage.setItem(this.STORAGE_KEY, historyId);
    }

    static getActive(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    }
}

export class ActiveProject {
    private static STORAGE_KEY = "activeProject";
  
    static setActive(projectId: string): void {
      localStorage.setItem(this.STORAGE_KEY, projectId);
    }
  
    static getActive(): string | null {
      return localStorage.getItem(this.STORAGE_KEY);
    }
  
    static clearActive(): void {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
