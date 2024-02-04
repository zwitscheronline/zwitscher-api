import { User } from "@prisma/client";

export type UserOutputStrict = Omit<User, "password" | "email">;
export type UserOutput = Omit<User, "password">;
