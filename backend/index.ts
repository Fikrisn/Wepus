// import { Hono } from 'hono'
// import { db } from "../db";

// const app = new Hono()

// app.get('/', async (c) => {
//   const result = await db.execute('select 1');
//   return c.json(result, 200)
// })

// export default app

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors'

const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}))

// route general
 
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Hono server running at http://localhost:3000");