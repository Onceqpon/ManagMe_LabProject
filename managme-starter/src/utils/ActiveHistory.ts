export class ActiveHistory {
    private static STORAGE_KEY = "activeHistory";

    static setActive(historyId: string) {
        localStorage.setItem(this.STORAGE_KEY, historyId);
    }

    static getActive(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    }
}
