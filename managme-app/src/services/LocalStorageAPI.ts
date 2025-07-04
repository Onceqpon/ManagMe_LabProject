import type { Project } from '../models/Project';
import type { Story } from '../models/Story';
import type { Task } from '../models/Task';

export class LocalStorageAPI {
  // --- Istniejący kod dla Projektów ---
  private projectsKey: string = 'projects';
  
  // ... (createProject, getProjects, etc. - bez zmian) ...
  
  // --- NOWOŚĆ: Zarządzanie Aktywnym Projektem ---
  private activeProjectKey: string = 'activeProjectId';

  getActiveProjectId(): string | null {
    return localStorage.getItem(this.activeProjectKey);
  }

  setActiveProjectId(id: string | null): void {
    if (id) {
      localStorage.setItem(this.activeProjectKey, id);
    } else {
      localStorage.removeItem(this.activeProjectKey);
    }
  }

  // --- NOWOŚĆ: CRUD dla Historyjek (Stories) ---
  private storiesKey: string = 'stories';

  private saveStories(stories: Story[]): void {
    localStorage.setItem(this.storiesKey, JSON.stringify(stories));
  }

  private getAllStories(): Story[] {
    const data = localStorage.getItem(this.storiesKey);
    return data ? JSON.parse(data) : [];
  }

  // Create Story
  createStory(storyData: Omit<Story, 'id' | 'createdAt'>): Story {
    const stories = this.getAllStories();
    const newStory: Story = {
      ...storyData,
      id: `story_${new Date().getTime()}`,
      createdAt: new Date().toISOString(),
    };
    stories.push(newStory);
    this.saveStories(stories);
    return newStory;
  }

  // Read Stories (dla konkretnego projektu)
  getStories(projectId: string): Story[] {
    const allStories = this.getAllStories();
    return allStories.filter(story => story.projectId === projectId);
  }

  // Update Story
  updateStory(id: string, updates: Partial<Omit<Story, 'id'>>): Story | null {
    const stories = this.getAllStories();
    const storyIndex = stories.findIndex(s => s.id === id);

    if (storyIndex === -1) return null;

    const updatedStory = { ...stories[storyIndex], ...updates };
    stories[storyIndex] = updatedStory;
    this.saveStories(stories);
    return updatedStory;
  }

  // Delete Story
  deleteStory(id: string): boolean {
    let stories = this.getAllStories();
    const initialLength = stories.length;
    stories = stories.filter(s => s.id !== id);

    if (stories.length < initialLength) {
      this.saveStories(stories);
      return true;
    }
    return false;
  }

  // Przeniesione z poprzedniej wersji - teraz tutaj
  // C - Create
  createProject(projectData: Omit<Project, 'id'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...projectData,
      id: `proj_${new Date().getTime()}_${Math.random()}`, // Proste unikalne ID
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  // R - Read (All)
  getProjects(): Project[] {
    const data = localStorage.getItem(this.projectsKey);
    return data ? JSON.parse(data) : [];
  }

  // D - Delete
  deleteProject(id: string): boolean {
    // Przy usuwaniu projektu, usuń też jego historyjki!
    const stories = this.getAllStories().filter(s => s.projectId !== id);
    this.saveStories(stories);
    
    let projects = this.getProjects();
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== id);

    if (projects.length < initialLength) {
      this.saveProjects(projects);
      // Jeśli usunięty projekt był aktywny, wyczyść wybór
      if (this.getActiveProjectId() === id) {
          this.setActiveProjectId(null);
      }
      return true;
    }
    return false;
  }

   private saveProjects(projects: Project[]): void {
    localStorage.setItem(this.projectsKey, JSON.stringify(projects));
  }

  private tasksKey: string = 'tasks';

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  private getAllTasks(): Task[] {
    const data = localStorage.getItem(this.tasksKey);
    return data ? JSON.parse(data) : [];
  }

  // Create Task
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'startedAt' | 'completedAt' | 'status' | 'assigneeId'>): Task {
    const tasks = this.getAllTasks();
    const newTask: Task = {
      ...taskData,
      id: `task_${new Date().getTime()}`,
      createdAt: new Date().toISOString(),
      status: 'todo',
      startedAt: null,
      completedAt: null,
      assigneeId: null,
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  // Read Tasks (dla konkretnej historyjki)
  getTasks(storyId: string): Task[] {
    return this.getAllTasks().filter(task => task.storyId === storyId);
  }

  
    // NOWA METODA PUBLICZNA
  getTaskById(id: string): Task | undefined {
        return this.getAllTasks().find(t => t.id === id);
    }

  // Update Task - kluczowa metoda z logiką biznesową
  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | null {
    const tasks = this.getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) return null;

    const originalTask = tasks[taskIndex];
    const updatedTask = { ...originalTask, ...updates };

    // Logika biznesowa: Przypisanie użytkownika zmienia stan na 'doing'
    if (updates.assigneeId && originalTask.status === 'todo') {
      updatedTask.status = 'doing';
      updatedTask.startedAt = new Date().toISOString();
    }

    // Logika biznesowa: Zmiana stanu na 'done'
    if (updates.status === 'done' && originalTask.status !== 'done') {
      updatedTask.completedAt = new Date().toISOString();
    }

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }
  
}