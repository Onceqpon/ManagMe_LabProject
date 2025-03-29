import { User } from "../types/User";

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
        return this.users.find(user => user.role === 'admin')!;
    }

    static getAllUsers(): User[] {
        return this.users;
    }
}
