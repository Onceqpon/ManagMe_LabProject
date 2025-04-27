import { User } from '../types/types';

export class UserSession {
  static async getLoggedUser(): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No user logged in');
    }

    const response = await fetch('http://localhost:3000/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user: User = await response.json();
    return user;
  }

  static async getAllUsers(): Promise<User[]> {
    // Tymczasowo zwracamy tylko zalogowanego użytkownika
    // W przyszłości można dodać endpoint do pobierania wszystkich użytkowników
    const loggedUser = await this.getLoggedUser();
    return [loggedUser];
  }

  static async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    return users.find((user) => user.id === id);
  }
}