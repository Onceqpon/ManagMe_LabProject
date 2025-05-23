import Project from "../model/projectModel";
import { Story } from "../model/storyModel";
import { Task } from "../model/taskModel";

class ProjectAPI {
  getTasksByProjectId(projectId: string): Task[] | null {
    const tasks: Task[] = this.getAllTasks();
    return tasks.filter((task) => task.projectId === projectId);
  }

  getTasksByStoryId(storyId: string): Task[] | null {
    const tasks: Task[] = this.getAllTasks();
    return tasks.filter((task) => task.storyId === storyId);
  }

  updateTask(updatedTask: Task) {
    const tasks: Task[] = this.getAllTasks();
    const index: number = tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  deleteTask(taskId: string) {
    const tasks: Task[] = this.getAllTasks().filter(
      (task) => task.id !== taskId
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const stories: Story[] = this.getAllStories();
    const updatedStories = stories.map((story) => {
      const updatedTaskIds = story.tasks.filter((id) => id !== taskId);
      return { ...story, tasks: updatedTaskIds };
    });

    localStorage.setItem("stories", JSON.stringify(updatedStories));
  }

  getTaskById(id: string) {
    const tasks: Task[] = this.getAllTasks();
    return tasks.find((task) => task.id === id) || null;
  }

  getAllProjects(): Project[] {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  }

  getAllTasks(): Task[] {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  getAllStories(): Story[] {
    return JSON.parse(localStorage.getItem("stories") || "[]");
  }

  getStoriesByProjectId(projectId: string): Story[] | null {
    const stories: Story[] = this.getAllStories();
    return stories.filter((story) => story.project === projectId);
  }

  getProjectById(id: string): Project | undefined {
    const projects: Project[] = this.getAllProjects();
    return projects.find((project) => project.id === id);
  }

  createProject(project: Project): void {
    const projects: Project[] = this.getAllProjects();
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  updateProject(updatedProject: Project): void {
    const projects: Project[] = this.getAllProjects();
    const index: number = projects.findIndex(
      (project) => project.id === updatedProject.id
    );
    if (index !== -1) {
      projects[index] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }

  updateStory(updatedStory: Story): void {
    const stories: Story[] = this.getAllStories();
    const index: number = stories.findIndex(
      (story) => story.id === updatedStory.id
    );
    if (index !== -1) {
      stories[index] = updatedStory;
      localStorage.setItem("stories", JSON.stringify(stories));
    }
  }

  createStory(projectId: string, story: Story): void {
    const projects: Project[] = this.getAllProjects();
    const project: Project | undefined = projects.find(
      (project) => project.id === projectId
    );
    if (project) {
      project.stories.push(story.id);
      this.updateProject(project);
    }
    const stories: Story[] = this.getAllStories();
    stories.push(story);
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  createTask(storyId: string, task: Task): void {
    const stories: Story[] = this.getAllStories();
    const story: Story | undefined = stories.find(
      (story) => story.id === storyId
    );
    if (story) {
      story.tasks.push(task.id);
      this.updateStory(story);
    }
    const tasks: Task[] = this.getAllTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  deleteProject(id: string): void {
    const projects: Project[] = this.getAllProjects().filter(
      (project) => project.id !== id
    );
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  deleteStory(id: string): void {
    const stories: Story[] = this.getAllStories().filter(
      (story) => story.id !== id
    );
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  deleteStoriesByProjectId(projectId: string): void {
    const stories: Story[] = this.getAllStories();
    const updatedStories = stories.filter(
      (story) => story.project !== projectId
    );
    localStorage.setItem("stories", JSON.stringify(updatedStories));
  }

  getStoryById(id: string): Story | null {
    const stories: Story[] = this.getAllStories();
    return stories.find((story) => story.id === id) || null;
  }
}

export default ProjectAPI;
