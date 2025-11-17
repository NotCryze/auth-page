import 'dotenv/config';
import * as schema from "@db/schema.js";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: import("pg").Pool;
};
