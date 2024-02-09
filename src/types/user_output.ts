import { User } from "@prisma/client";
import { excludeFields } from "../utils/exclude";

export type UserOutputStrict = Omit<User, "password" | "email" | "tokenVersion">;
export type UserOutput = Omit<User, "password">;

export const toUserOutputStrict = (user: User|User[]): UserOutputStrict | UserOutputStrict[] => {
    if (Array.isArray(user)) {
        let users: UserOutputStrict[] = [];
        user.forEach((u) => {
            users.push(excludeFields(u, ["password", "email", "tokenVersion"]));
        });
        return users;
    } else {
        return excludeFields(user, ["password", "email", "tokenVersion"]);
    }
}

export const toUserOutput = (user: User|User[]): UserOutput | UserOutput[] => {
    if (Array.isArray(user)) {
        let users: UserOutput[] = [];
        user.forEach((u) => {
            users.push(excludeFields(u, ["password"]));
        });
        return users;
    } else {
        return excludeFields(user, ["password"]);
    }
}
