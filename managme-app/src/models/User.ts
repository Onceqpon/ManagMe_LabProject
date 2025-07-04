export type Role = 'admin' | 'devops' | 'developer';

export type User = {
  id: string;
  firstName: string;
  lastName:string;
  role: Role;
};