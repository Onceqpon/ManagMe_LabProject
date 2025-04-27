export interface User {
    id: string;
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'devops' | 'developer';
  }
  