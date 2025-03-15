import { User } from "../types/User";

export class UserSession {
    private static mockUser: User = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
    };

    static getLoggedUser(): User {
        return this.mockUser;
    }
}