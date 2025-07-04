export interface Task {
        id: string;
        name: string;
        status: 'todo' | 'doing' | 'done';
        estimated_time?: number;
        assignee_id?: string;
        users?: { first_name?: string; last_name?: string };
    }