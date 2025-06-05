import { User, UserRole } from "../models/userModel";

class UsersDB {
  static initializeUsers(): User[] {
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Admin",
        password: "admin",
        role: UserRole.Admin,
      },
      {
        id: "2",
        name: "Piotr",
        password: "piotr",
        role: UserRole.DevOps,
      },
      {
        id: "3",
        name: "Mariusz",
        password: "mariusz",
        role: UserRole.Developer,
      },
    ];
    return defaultUsers;
  }

  static getAll(): User[] {
    return this.initializeUsers();
  }

  static getUserById(assignedUserId: string): User | undefined {
    return UsersDB.getAll().find((user) => user.id === assignedUserId);
  }
}

export default UsersDB;
