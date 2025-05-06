import {Hono} from "hono"
import { db } from "../../db";

const app = new Hono();

app.get("/", async (c) => {
    const result = await db.execute("select 1")
    return c.json(result, 200);
})

export default app