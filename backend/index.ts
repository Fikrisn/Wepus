import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import kategoriRoute from "./routers/kategori";
import pembuatRoute from "./routers/pembuat";
import penerbitRoute from "./routers/penerbit";
import bukuRoute from "./routers/buku";

const app = new Hono();

// CORS untuk akses frontend dari localhost:5173 (Vite default port)
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}));

// Daftar semua router
app.route('/kategori', kategoriRoute);
app.route('/pembuat', pembuatRoute);
app.route('/penerbit', penerbitRoute);
app.route('/buku', bukuRoute);

// Jalankan server di port 3000
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Hono server running at http://localhost:3000");
