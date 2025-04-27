export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdAt: string;
  status: 'todo' | 'doing' | 'done';
  ownerId: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  storyId: string;
  estimatedTime: number;
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
  assignedUserId?: string;
  startedAt?: string;
  finishedAt?: string;
}