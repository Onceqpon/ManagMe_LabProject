enum StoryStatus {
  Todo = "Todo",
  Doing = "Doing",
  Done = "Done",
}

enum StoryPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

class Story {
  id: string;
  name: string;
  description: string;
  priority: StoryPriority;
  project: string;
  createdAt: Date;
  status: StoryStatus;
  owner: string;
  tasks: string[] = [];

  constructor(
    id: string,
    name: string,
    description: string,
    priority: StoryPriority,
    project: string,
    owner: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.project = project;
    this.createdAt = new Date();
    this.status = StoryStatus.Todo;
    this.owner = owner;
  }
}

export { Story, StoryStatus, StoryPriority };
