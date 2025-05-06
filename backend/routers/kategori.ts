import { Hono } from "hono";
import { db } from "../../db";
import { kategori, buku } from "../../db/schema";
import { eq, like, and, not } from "drizzle-orm";

const kategoriRoute = new Hono();

// Fungsi validasi manual
function validateKategori(body: any) {
  const errors = [];

  if (!body.kodeKategori || typeof body.kodeKategori !== "string" || body.kodeKategori.trim() === "") {
    errors.push("Kode kategori harus diisi dan tidak boleh kosong");
  }

  if (!body.namaKategori || typeof body.namaKategori !== "string" || body.namaKategori.trim() === "") {
    errors.push("Nama kategori harus diisi dan tidak boleh kosong");
  }

  return errors;
}

kategoriRoute

  // Mendapatkan semua kategori
  .get("/get", async (c) => {
    try {
      const result = await db.select().from(kategori).orderBy(kategori.namaKategori);
      return c.json({
        status: true,
        message: "Berhasil mendapatkan data kategori",
        data: result,
      });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mendapatkan data kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  // Mendapatkan detail kategori berdasarkan ID
  .get("/get/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const result = await db.select().from(kategori).where(eq(kategori.idKategori, id));
      if (!result.length) {
        return c.json({ status: false, message: "Kategori tidak ditemukan" }, 404);
      }
      return c.json({
        status: true,
        message: "Berhasil mendapatkan detail kategori",
        data: result[0],
      });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mendapatkan detail kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  // Mencari kategori
  .get("/search", async (c) => {
    try {
      const { q } = c.req.query();
      if (!q) {
        return c.json({ status: false, message: "Parameter pencarian (q) diperlukan" }, 400);
      }
      const result = await db
        .select()
        .from(kategori)
        .where(like(kategori.namaKategori, `%${q}%`))
        .orderBy(kategori.namaKategori);

      return c.json({
        status: true,
        message: "Berhasil mencari data kategori",
        data: result,
      });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mencari data kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  // Menambahkan kategori
  .post("/tambah-kategori", async (c) => {
    try {
      const body = await c.req.json();
      const errors = validateKategori(body);
      if (errors.length) {
        return c.json({ status: false, message: errors.join(", ") }, 400);
      }

      const kodeExists = await db.select().from(kategori).where(eq(kategori.kodeKategori, body.kodeKategori));
      if (kodeExists.length > 0) {
        return c.json({ status: false, message: "Kode kategori sudah digunakan" }, 400);
      }

      const result = await db.insert(kategori).values({
        kodeKategori: body.kodeKategori,
        namaKategori: body.namaKategori,
      }).returning();

      return c.json({ status: true, message: "Berhasil menambahkan kategori", data: result[0] }, 201);
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal menambahkan kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  // Mengupdate kategori
  .put("/update-kategori/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const errors = validateKategori(body);
      if (errors.length) {
        return c.json({ status: false, message: errors.join(", ") }, 400);
      }

      const kategoriExists = await db.select().from(kategori).where(eq(kategori.idKategori, id));
      if (!kategoriExists.length) {
        return c.json({ status: false, message: "Kategori tidak ditemukan" }, 404);
      }

      const kodeExists = await db
        .select()
        .from(kategori)
        .where(and(eq(kategori.kodeKategori, body.kodeKategori), not(eq(kategori.idKategori, id))));

      if (kodeExists.length > 0) {
        return c.json({ status: false, message: "Kode kategori sudah digunakan" }, 400);
      }

      const result = await db.update(kategori)
        .set({
          kodeKategori: body.kodeKategori,
          namaKategori: body.namaKategori,
          updatedAt: new Date(),
        })
        .where(eq(kategori.idKategori, id))
        .returning();

      return c.json({ status: true, message: "Berhasil mengupdate kategori", data: result[0] });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mengupdate kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  // Menghapus kategori
  .delete("/hapus-kategori/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));

      const kategoriExists = await db.select().from(kategori).where(eq(kategori.idKategori, id));
      if (!kategoriExists.length) {
        return c.json({ status: false, message: "Kategori tidak ditemukan" }, 404);
      }

      const bukuExists = await db.select().from(buku).where(eq(buku.idKategori, id));
      if (bukuExists.length > 0) {
        return c.json({ status: false, message: "Kategori tidak dapat dihapus karena masih digunakan oleh buku" }, 400);
      }

      const result = await db.delete(kategori).where(eq(kategori.idKategori, id)).returning();

      return c.json({ status: true, message: "Berhasil menghapus kategori", data: result[0] });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal menghapus kategori",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  });

export default kategoriRoute;
