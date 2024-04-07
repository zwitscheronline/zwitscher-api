import { User } from "./schema-types";

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: User;
};
