import { db } from "../src/db.js"; 
import { ssoProvider } from "../../../packages/db/src/schema.js";

const result = await db.select().from(ssoProvider);
console.log(JSON.stringify(result, null, 2));
