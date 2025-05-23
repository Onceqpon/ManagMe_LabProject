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
  storyId: Story["id"];
  projectId: Project["id"];
  estimatedTime: number;
  status: TaskStatus;
  createdAt: Date;
  startAt?: Date;
  endAt?: Date;
  assignedUserId?: User["id"];

  constructor(
    id: string,
    name: string,
    description: string,
    priority: TaskPriority,
    storyId: Story["id"],
    projectId: Project["id"],
    estimatedTime: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.storyId = storyId;
    this.projectId = projectId;
    this.estimatedTime = estimatedTime;
    this.status = TaskStatus.Todo;
    this.createdAt = new Date();
  }

  startTask(user: User) {
    this.status = TaskStatus.Doing;
    this.startAt = new Date();
    this.assignedUserId = user.id;
  }

  completeTask() {
    this.status = TaskStatus.Done;
    this.endAt = new Date();
  }
}

export { Task, TaskStatus, TaskPriority };
