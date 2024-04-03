import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), {
    migrationsFolder: "./db/drizzle",
}).then(() => {
    console.log("Migration complete");
    process.exit(0);
});
