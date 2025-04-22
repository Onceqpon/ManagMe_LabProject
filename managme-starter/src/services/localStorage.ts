import { Project, Story, Task } from '../types/types';


abstract class StorageBase {
  protected static safeGetData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  protected static saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export class ProjectStorage extends StorageBase {
  private static PROJECTS_KEY = "projects";
  private static STORIES_KEY = "stories";
  private static TASKS_KEY = "tasks";

  // Operacje na projektach
  static getAllProjects(): Project[] {
    return this.safeGetData<Project>(this.PROJECTS_KEY);
  }

  static getProjectById(id: string): Project | undefined {
    return this.getAllProjects().find((project) => project.id === id);
  }

  static addProject(project: Project): void {
    const projects = this.getAllProjects();
    projects.push(project);
    this.saveData(this.PROJECTS_KEY, projects);
  }

  static updateProject(updateProject: Project): void {
    let projects = this.getAllProjects();
    projects = projects.map((p) => (p.id === updateProject.id ? updateProject : p));
    this.saveData(this.PROJECTS_KEY, projects);
  }

  static deleteProject(id: string): void {
    const projects = this.getAllProjects().filter((p) => p.id !== id);
    this.saveData(this.PROJECTS_KEY, projects);
  }

  // Operacje na historyjkach
  static getAllStories(projectId?: string): Story[] {
    const stories = this.safeGetData<Story>(this.STORIES_KEY);
    return projectId ? stories.filter((story) => story.projectId === projectId) : stories;
  }

  static getStoryById(id: string): Story | undefined {
    return this.getAllStories().find((story) => story.id === id);
  }

  static addStory(story: Story): void {
    const stories = this.getAllStories();
    stories.push(story);
    this.saveData(this.STORIES_KEY, stories);
  }

  static updateStory(updatedStory: Story): void {
    let stories = this.getAllStories();
    stories = stories.map((s) => (s.id === updatedStory.id ? updatedStory : s));
    this.saveData(this.STORIES_KEY, stories);
  }

  static deleteStory(id: string): void {
    const stories = this.getAllStories().filter((s) => s.id !== id);
    this.saveData(this.STORIES_KEY, stories);
  }

  // Operacje na zadaniach
  static getAllTasks(storyId?: string): Task[] {
    const tasks = this.safeGetData<Task>(this.TASKS_KEY);
    return storyId ? tasks.filter((task) => task.storyId === storyId) : tasks;
  }

  static getTaskById(id: string): Task | undefined {
    return this.getAllTasks().find((task) => task.id === id);
  }

  static addTask(task: Task): void {
    const tasks = this.getAllTasks();
    tasks.push(task);
    this.saveData(this.TASKS_KEY, tasks);
  }

  static updateTask(updatedTask: Task): void {
    let tasks = this.getAllTasks();
    tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    this.saveData(this.TASKS_KEY, tasks);
  }

  static deleteTask(id: string): void {
    const tasks = this.getAllTasks().filter((t) => t.id !== id);
    this.saveData(this.TASKS_KEY, tasks);
  }
}