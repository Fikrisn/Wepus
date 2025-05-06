import { Hono } from "hono";
import { db } from "../../db";
import { pembuat } from "../../db/schema";
import { eq, like } from "drizzle-orm";

const pembuatRoute = new Hono();

// Mendapatkan semua pembuat
pembuatRoute.get('/get', async (c) => {
  try {
    const result = await db.select().from(pembuat).orderBy(pembuat.namaPembuat);
    return c.json({
      status: true,
      message: "Berhasil mendapatkan data pembuat",
      data: result
    }, 200);
  } catch (e) {
    return c.json({
      status: false,
      message: "Gagal mendapatkan data pembuat",
      error: e instanceof Error ? e.message : String(e)
    }, 400);
  }
});

// Mendapatkan pembuat berdasarkan ID
pembuatRoute.get('/get/:id', async (c) => {
  try {
    const id = c.req.param("id");
    const result = await db.select().from(pembuat).where(eq(pembuat.idPembuat, Number(id)));
    if (!result.length) {
      return c.json({ status: false, message: "Pembuat tidak ditemukan" }, 404);
    }
    return c.json({ status: true, message: "Berhasil mendapatkan detail pembuat", data: result[0] }, 200);
  } catch (e) {
    return c.json({ status: false, message: "Gagal mendapatkan detail pembuat", error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

// Mencari pembuat berdasarkan nama
pembuatRoute.get('/search', async (c) => {
  try {
    const { q } = c.req.query();
    if (!q) {
      return c.json({ status: false, message: "Parameter q diperlukan" }, 400);
    }

    const result = await db
      .select()
      .from(pembuat)
      .where(like(pembuat.namaPembuat, `%${q}%`))
      .orderBy(pembuat.namaPembuat);

    return c.json({ status: true, message: "Berhasil mencari data pembuat", data: result }, 200);
  } catch (e) {
    return c.json({ status: false, message: "Gagal mencari data pembuat", error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

// Menambahkan pembuat
pembuatRoute.post('/tambah-pembuat', async (c) => {
  try {
    const body = await c.req.json();
    if (!body.namaPembuat || typeof body.namaPembuat !== 'string' || !body.namaPembuat.trim()) {
      return c.json({ status: false, message: "Nama pembuat harus diisi dan tidak boleh kosong" }, 400);
    }

    const result = await db.insert(pembuat).values({
      namaPembuat: body.namaPembuat.trim()
    }).returning();

    return c.json({ status: true, message: "Berhasil menambahkan pembuat", data: result[0] }, 201);
  } catch (e) {
    return c.json({ status: false, message: "Gagal menambahkan pembuat", error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

// Mengupdate pembuat
pembuatRoute.put('/update-pembuat/:id', async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!body.namaPembuat || typeof body.namaPembuat !== 'string' || !body.namaPembuat.trim()) {
      return c.json({ status: false, message: "Nama pembuat harus diisi dan tidak boleh kosong" }, 400);
    }

    const existing = await db.select().from(pembuat).where(eq(pembuat.idPembuat, Number(id)));
    if (!existing.length) {
      return c.json({ status: false, message: "Pembuat tidak ditemukan" }, 404);
    }

    const result = await db.update(pembuat)
      .set({
        namaPembuat: body.namaPembuat.trim(),
        updatedAt: new Date()
      })
      .where(eq(pembuat.idPembuat, Number(id)))
      .returning();

    return c.json({ status: true, message: "Berhasil mengupdate pembuat", data: result[0] }, 200);
  } catch (e) {
    return c.json({ status: false, message: "Gagal mengupdate pembuat", error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

// Menghapus pembuat
pembuatRoute.delete('/hapus-pembuat/:id', async (c) => {
  try {
    const id = c.req.param("id");

    const existing = await db.select().from(pembuat).where(eq(pembuat.idPembuat, Number(id)));
    if (!existing.length) {
      return c.json({ status: false, message: "Pembuat tidak ditemukan" }, 404);
    }

    const result = await db.delete(pembuat).where(eq(pembuat.idPembuat, Number(id))).returning();

    return c.json({ status: true, message: "Berhasil menghapus pembuat", data: result[0] }, 200);
  } catch (e) {
    return c.json({ status: false, message: "Gagal menghapus pembuat", error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

export default pembuatRoute;
