import { supabase } from "./supabaseClient";
import Project from "../models/projectModel";
import { Story } from "../models/storyModel";
import { Task } from "../models/taskModel";
import { User } from "../models/userModel";
import { currentUser } from "../views/main";

class ProjectAPI {
  // ===== Tasks =====

  async getTasksByProjectId(projectId: string): Promise<Task[] | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId);
    if (error) {
      console.error(error);
      return null;
    }
    return data as Task[];
  }

  async getTasksByStoryId(storyId: string): Promise<Task[] | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("story_id", storyId);
    if (error) {
      console.error(error);
      return null;
    }
    return data as Task[];
  }

  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data as Task;
  }

  async createTask(storyId: string, task: Task): Promise<void> {
    task.story_id = storyId;
    const { error } = await supabase.from("tasks").insert([task]);
    if (error) console.error("Błąd przy tworzeniu zadania:", error);
  }

  async updateTask(updatedTask: Task): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .update(updatedTask)
      .eq("id", updatedTask.id);
    if (error) console.error(error);
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);
    if (error) console.error(error);
  }

  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      console.error(error);
      return [];
    }
    return data as Task[];
  }

  // ===== Stories =====

  async getAllStories(): Promise<Story[]> {
    const { data, error } = await supabase.from("stories").select("*");
    if (error) {
      console.error(error);
      return [];
    }
    return data as Story[];
  }

  async getStoryById(id: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data as Story;
  }

  async getStoriesByProjectId(projectId: string): Promise<Story[] | null> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("project_id", projectId);
    if (error) {
      console.error(error);
      return null;
    }
    return data as Story[];
  }

  async createStory(projectId: string, story: Story): Promise<void> {
    const { id, name, description, priority, status, owner_id } = story;

    const { error } = await supabase.from("stories").insert([{
      id,
      name,
      description,
      priority,
      status,
      project_id: projectId,
      owner_id,
    }]);

    if (error) console.error("Błąd przy tworzeniu story:", error);
  }

  async updateStory(updatedStory: Story): Promise<void> {
    const { error } = await supabase
      .from("stories")
      .update(updatedStory)
      .eq("id", updatedStory.id);
    if (error) console.error(error);
  }

  async deleteStory(id: string): Promise<void> {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
  }

  async deleteStoriesByProjectId(projectId: string): Promise<void> {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("project_id", projectId);
    if (error) console.error(error);
  }

  // ===== Projects =====

  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error(error);
      return [];
    }
    return data as Project[];
  }

  async getProjectsByUser(): Promise<Project[]> {
  if (!currentUser?.id) {
    console.error("Brak zalogowanego użytkownika");
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", currentUser.id);

  if (error) {
    console.error("Błąd przy pobieraniu projektów użytkownika:", error);
    return [];
  }

  return data as Project[];
}

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data as Project;
  }

  async createProject(project: Project): Promise<void> {
    const { id, name, description, active, owner_id } = project;

    const { error } = await supabase.from("projects").insert([{
      id,
      name,
      description,
      active,
      owner_id: owner_id, // 👈 ważne: snake_case
    }]);

    if (error) console.error("Błąd przy tworzeniu projektu:", error);
  }

  async updateProject(updatedProject: Project): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", updatedProject.id);
    if (error) console.error(error);
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
  }

  // ===== Users =====

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Błąd przy pobieraniu użytkowników:", error);
      return [];
    }
    return data || [];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Błąd przy pobieraniu użytkownika:", error);
      return null;
    }

    return data;
  }
}

export default ProjectAPI;
