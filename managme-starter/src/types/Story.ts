export type StoryState = "todo" | "in-progress" | "done";
export type StoryPriority = "niski" | "średni" | "wysoki";

export interface Story {
    id: string;
    name: string;
    description: string;
    priority: StoryPriority;
    projectId: string;
    createdAt: string;
    state: StoryState;
    ownerId: string;
}