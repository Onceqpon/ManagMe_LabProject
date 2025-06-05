enum UserRole {
  Admin = "Admin",
  DevOps = "DevOps",
  Developer = "Developer",
}

class User {
  id: string;
  name: string;
  password: string;
  role: UserRole;

  constructor(id: string, name: string, password: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
  }
}

export { User, UserRole };
