import { Story } from "./storyModel";

class Project {
  id: string;
  name: string;
  description: string;
  active: boolean;
  stories: string[] = [];

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.active = false;
  }

  addStory(story: Story): void {
    this.stories.push(story.id);
  }
}

export default Project;
