class Project {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at?: Date;
  owner_id?: string;

  constructor(id: string, name: string, description: string, owner_id?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.active = false;
    this.owner_id = owner_id;
  }
}
export default Project;