import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export const initDatabaseConnection = () => {
    prismaClient.$connect();
}
