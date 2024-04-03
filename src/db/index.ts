import postgres from "postgres";
import { drizzle } from 'drizzle-orm/postgres-js';
import * as users from "./schema/users";
import * as posts from "./schema/posts";
import * as likes from "./schema/likes";
import * as bookmarks from "./schema/bookmarks";
import * as follows from "./schema/follows";
import * as lists from "./schema/lists";
import * as listFollowers from "./schema/list-followers";
import * as listMembers from "./schema/list-members";
import * as groups from "./schema/groups";
import * as groupMembers from "./schema/group-members";
import * as groupJoinRequests from "./schema/group-join-requests";

const schema = {
    ...users,
    ...posts,
    ...likes,
    ...bookmarks,
    ...follows,
    ...lists,
    ...listFollowers,
    ...listMembers,
    ...groups,
    ...groupMembers,
    ...groupJoinRequests,
};

export const getConnection = () => {
    if (process.env.DATABASE_URL === undefined) {
        throw new Error("DATABASE_URL is not defined");
    }

    const client = postgres(process.env.DATABASE_URL, {});
    return drizzle(client, { schema });
}
