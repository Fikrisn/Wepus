import { Hono } from "hono";
import { db } from "../../db";
import { penerbit } from "../../db/schema";
import { eq, like } from "drizzle-orm";

const penerbitRoute = new Hono();

// Schema validasi manual untuk penerbit
const validatePenerbit = (body: any) => {
  if (!body.namaPenerbit || body.namaPenerbit.trim() === "") {
    return "Nama penerbit tidak boleh kosong";
  }
  return null;
};

penerbitRoute
  // Mendapatkan semua penerbit
  .get('/get', async (c) => {
    try {
      const result = await db.select().from(penerbit).orderBy(penerbit.namaPenerbit);
      
      return c.json(result);
    } catch (error) {
      console.error("Error fetching publishers:", error);
      return c.json({
        status: false,
        message: "Gagal mendapatkan data penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })

  // Mendapatkan detail penerbit berdasarkan ID
  .get('/get/:id', async (c) => {
    try {
      const id = c.req.param("id");
      
      const result = await db
        .select()
        .from(penerbit)
        .where(eq(penerbit.idPenerbit, Number(id)));

      if (!result.length) {
        return c.json({
          status: false,
          message: "Penerbit tidak ditemukan"
        }, 404);
      }

      return c.json({
        status: true,
        message: "Berhasil mendapatkan detail penerbit",
        data: result[0]
      }, 200);
    } catch (error) {
      console.error("Error fetching publisher:", error);
      return c.json({
        status: false,
        message: "Gagal mendapatkan detail penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })

  // Mencari penerbit berdasarkan kata kunci
  .get('/search', async (c) => {
    try {
      const { q } = c.req.query();
      
      if (!q) {
        return c.json({
          status: false,
          message: "Parameter pencarian (q) diperlukan"
        }, 400);
      }
      
      const result = await db
        .select()
        .from(penerbit)
        .where(like(penerbit.namaPenerbit, `%${q}%`))
        .orderBy(penerbit.namaPenerbit);

      return c.json({
        status: true,
        message: "Berhasil mencari data penerbit",
        data: result
      }, 200);
    } catch (error) {
      console.error("Error searching publishers:", error);
      return c.json({
        status: false,
        message: "Gagal mencari data penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })

  // Menambahkan penerbit baru
  .post('/tambah-penerbit', async (c) => {
    try {
      const body = await c.req.json();
      
      const validationError = validatePenerbit(body);
      if (validationError) {
        return c.json({
          status: false,
          message: validationError
        }, 400);
      }

      const result = await db.insert(penerbit).values({
        namaPenerbit: body.namaPenerbit
      }).returning();

      return c.json({
        status: true,
        message: "Berhasil menambahkan penerbit",
        data: result[0]
      }, 201);
    } catch (error) {
      console.error("Error adding publisher:", error);
      return c.json({
        status: false,
        message: "Gagal menambahkan penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })

  // Mengupdate penerbit berdasarkan ID
  .put('/update-penerbit/:id', async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      
      const validationError = validatePenerbit(body);
      if (validationError) {
        return c.json({
          status: false,
          message: validationError
        }, 400);
      }

      // Memeriksa apakah penerbit ada
      const penerbitExists = await db
        .select()
        .from(penerbit)
        .where(eq(penerbit.idPenerbit, Number(id)));
      
      if (penerbitExists.length === 0) {
        return c.json({
          status: false,
          message: "Penerbit tidak ditemukan"
        }, 404);
      }

      const result = await db.update(penerbit)
        .set({
          namaPenerbit: body.namaPenerbit,
          updatedAt: new Date()
        })
        .where(eq(penerbit.idPenerbit, Number(id)))
        .returning();

      return c.json({
        status: true,
        message: "Berhasil mengupdate penerbit",
        data: result[0]
      }, 200);
    } catch (error) {
      console.error("Error updating publisher:", error);
      return c.json({
        status: false,
        message: "Gagal mengupdate penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  })
  
  // Menghapus penerbit berdasarkan ID
  .delete('/hapus-penerbit/:id', async (c) => {
    try {
      const id = c.req.param("id");
  
      // Periksa apakah penerbit ada
      const penerbitExists = await db
        .select()
        .from(penerbit)
        .where(eq(penerbit.idPenerbit, Number(id)));
  
      if (penerbitExists.length === 0) {
        return c.json({
          status: false,
          message: "Penerbit tidak ditemukan"
        }, 404);
      }
  
      // Hapus penerbit
      const result = await db
        .delete(penerbit)
        .where(eq(penerbit.idPenerbit, Number(id)))
        .returning();
  
      return c.json({
        status: true,
        message: "Berhasil menghapus penerbit",
        data: result[0]
      }, 200);
    } catch (error) {
      console.error("Error deleting publisher:", error);
      return c.json({
        status: false,
        message: "Gagal menghapus penerbit",
        error: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  });
  
export default penerbitRoute;
