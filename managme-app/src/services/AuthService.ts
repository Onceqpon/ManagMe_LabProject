import type { Role, User } from '../models/User';

export class AuthService {
  private users: User[];
  private loggedInUser: User;

  constructor() {
    // Mock listy użytkowników
    this.users = [
      { id: 'user_1', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
      { id: 'user_2', firstName: 'Anna', lastName: 'Nowak', role: 'developer' },
      { id: 'user_3', firstName: 'Piotr', lastName: 'Zieliński', role: 'developer' },
      { id: 'user_4', firstName: 'Katarzyna', lastName: 'Wójcik', role: 'devops' },
    ];
    this.loggedInUser = this.users[0]; // Jan Kowalski jest adminem
  }

  public getLoggedInUser(): User {
    return this.loggedInUser;
  }
  
  public getUsers(): User[] {
    return this.users;
  }

  // Zwraca tylko developerów i devopsów
  public getAssignableUsers(): User[] {
    return this.users.filter(u => u.role === 'developer' || u.role === 'devops');
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}