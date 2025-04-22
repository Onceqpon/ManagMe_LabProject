import { User } from '../types/types';

export class UserSession {
  private static users: User[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      role: "admin",
    },
    {
      id: "2",
      firstName: "Anna",
      lastName: "Smith",
      role: "developer",
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      role: "devops",
    },
  ];

  static getLoggedUser(): User {
    const admin = this.users.find((user) => user.role === 'admin');
    if (!admin) {
      return this.users[0] || {
        id: "0",
        firstName: "Guest",
        lastName: "User",
        role: "developer",
      };
    }
    return admin;
  }

  static getAllUsers(): User[] {
    return this.users;
  }

  static getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}