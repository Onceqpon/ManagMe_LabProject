export interface Story {
        id: string;
        name: string;
        description?: string;
        priority: 'niski' | 'średni' | 'wysoki';
    }