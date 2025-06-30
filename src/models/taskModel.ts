import { User } from "./userModel";
import { Story } from "./storyModel";
import Project from "./projectModel";

enum TaskStatus {
  Todo = "Todo",
  Doing = "Doing",
  Done = "Done",
}

enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

class Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  story_id: Story["id"];
  project_id: Project["id"];
  estimated_time: number;
  status: TaskStatus;
  created_at: Date;
  start_at?: Date;
  end_at?: Date;
  assigned_user_id?: User["id"];

  constructor(
    id: string,
    name: string,
    description: string,
    priority: TaskPriority,
    story_id: Story["id"],
    project_id: Project["id"],
    estimated_time: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.story_id = story_id;
    this.project_id = project_id;
    this.estimated_time = estimated_time;
    this.status = TaskStatus.Todo;
    this.created_at = new Date();
  }

  startTask(user: User) {
    this.status = TaskStatus.Doing;
    this.start_at = new Date();
    this.assigned_user_id = user.id;
  }

  completeTask() {
    this.status = TaskStatus.Done;
    this.end_at = new Date();
  }
}

export { Task, TaskStatus, TaskPriority };
