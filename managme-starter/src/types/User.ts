export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'devops' | 'developer';
}