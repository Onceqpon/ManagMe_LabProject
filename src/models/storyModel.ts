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
  project_id: string;
  created_at: Date;
  status: StoryStatus;
  owner_id: string;

  constructor(
    id: string,
    name: string,
    description: string,
    priority: StoryPriority,
    project_id: string,
    owner_id: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.project_id = project_id;
    this.created_at = new Date();
    this.status = StoryStatus.Todo;
    this.owner_id = owner_id;
  }
}

export { Story, StoryStatus, StoryPriority };
