export interface Project {
    id: string;
    name: string;
    description: string;
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'devops' | 'developer';
  }
  
  export interface Story {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdAt: string; // ISO string, np. "2025-04-22T10:00:00Z"
    status: 'todo' | 'doing' | 'done';
    ownerId: string;
  }

  export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: number; // w godzinach
    status: 'todo' | 'doing' | 'done';
    createdAt: string; // ISO string
    startedAt?: string; // ISO string, wymagane dla doing
    finishedAt?: string; // ISO string, wymagane dla done
    assignedUserId?: string; // wymagane dla doing i done, tylko devops/developer
  }