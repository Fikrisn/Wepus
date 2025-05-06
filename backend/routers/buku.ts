import { Hono } from "hono";
import { db } from "../../db";
import { buku, kategori, pembuat, penerbit } from "../../db/schema";
import { eq, like, and, or } from "drizzle-orm";

const bukuRoute = new Hono();

// Helper: Validasi data buku secara manual
function validateBuku(body: any) {
  const errors: string[] = [];

  if (!body.idKategori) errors.push("ID kategori harus diisi");
  if (!body.idPenerbit) errors.push("ID penerbit harus diisi");
  if (!body.idPembuat) errors.push("ID pembuat harus diisi");

  if (!body.namaBuku || typeof body.namaBuku !== "string" || body.namaBuku.trim() === "")
    errors.push("Nama buku tidak boleh kosong");

  if (!body.tahunPembuatan || body.tahunPembuatan.length !== 4)
    errors.push("Tahun harus 4 digit");

  if (typeof body.harga !== "number" || body.harga < 0)
    errors.push("Harga tidak boleh negatif");

  return errors;
}

bukuRoute
  .get("/get", async (c) => {
    try {
      const result = await db
        .select({
          buku: {
            idBuku: buku.idBuku,
            namaBuku: buku.namaBuku,
            isbn: buku.isbn,
            issn: buku.issn,
            tahunPembuatan: buku.tahunPembuatan,
            harga: buku.harga,
            keterangan: buku.keterangan,
            createdAt: buku.createdAt,
            updatedAt: buku.updatedAt,
          },
          kategori: {
            idKategori: kategori.idKategori,
            namaKategori: kategori.namaKategori,
          },
          penerbit: {
            idPenerbit: penerbit.idPenerbit,
            namaPenerbit: penerbit.namaPenerbit,
          },
          pembuat: {
            idPembuat: pembuat.idPembuat,
            namaPembuat: pembuat.namaPembuat,
          },
        })
        .from(buku)
        .leftJoin(kategori, eq(buku.idKategori, kategori.idKategori))
        .leftJoin(penerbit, eq(buku.idPenerbit, penerbit.idPenerbit))
        .leftJoin(pembuat, eq(buku.idPembuat, pembuat.idPembuat))
        .orderBy(buku.idBuku);

      return c.json({ status: true, message: "Berhasil mendapatkan data buku", data: result });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mendapatkan data buku",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  .get("/get/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));

      const result = await db
        .select({
          buku: {
            idBuku: buku.idBuku,
            namaBuku: buku.namaBuku,
            isbn: buku.isbn,
            issn: buku.issn,
            tahunPembuatan: buku.tahunPembuatan,
            harga: buku.harga,
            keterangan: buku.keterangan,
            createdAt: buku.createdAt,
            updatedAt: buku.updatedAt,
          },
          kategori: {
            idKategori: kategori.idKategori,
            namaKategori: kategori.namaKategori,
          },
          penerbit: {
            idPenerbit: penerbit.idPenerbit,
            namaPenerbit: penerbit.namaPenerbit,
          },
          pembuat: {
            idPembuat: pembuat.idPembuat,
            namaPembuat: pembuat.namaPembuat,
          },
        })
        .from(buku)
        .leftJoin(kategori, eq(buku.idKategori, kategori.idKategori))
        .leftJoin(penerbit, eq(buku.idPenerbit, penerbit.idPenerbit))
        .leftJoin(pembuat, eq(buku.idPembuat, pembuat.idPembuat))
        .where(eq(buku.idBuku, id));

      if (!result.length) {
        return c.json({ status: false, message: "Buku tidak ditemukan" }, 404);
      }

      return c.json({ status: true, message: "Berhasil mendapatkan detail buku", data: result[0] });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mendapatkan detail buku",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  .get("/search", async (c) => {
    try {
      const { q, kategori: kategoriId, penerbit: penerbitId } = c.req.query();
      let filters = [];

      if (q) {
        filters.push(
          or(
            like(buku.namaBuku, `%${q}%`),
            like(buku.isbn, `%${q}%`),
            like(buku.issn, `%${q}%`)
          )
        );
      }

      if (kategoriId) filters.push(eq(buku.idKategori, Number(kategoriId)));
      if (penerbitId) filters.push(eq(buku.idPenerbit, Number(penerbitId)));

      const result = await db
        .select({
          buku: {
            idBuku: buku.idBuku,
            namaBuku: buku.namaBuku,
            isbn: buku.isbn,
            issn: buku.issn,
            tahunPembuatan: buku.tahunPembuatan,
            harga: buku.harga,
            keterangan: buku.keterangan,
          },
          kategori: {
            idKategori: kategori.idKategori,
            namaKategori: kategori.namaKategori,
          },
          penerbit: {
            idPenerbit: penerbit.idPenerbit,
            namaPenerbit: penerbit.namaPenerbit,
          },
          pembuat: {
            idPembuat: pembuat.idPembuat,
            namaPembuat: pembuat.namaPembuat,
          },
        })
        .from(buku)
        .leftJoin(kategori, eq(buku.idKategori, kategori.idKategori))
        .leftJoin(penerbit, eq(buku.idPenerbit, penerbit.idPenerbit))
        .leftJoin(pembuat, eq(buku.idPembuat, pembuat.idPembuat))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(buku.namaBuku);

      return c.json({ status: true, message: "Berhasil mencari data buku", data: result });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal mencari data buku",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  .post("/tambah-buku", async (c) => {
    try {
      const body = await c.req.json();
      const errors = validateBuku(body);
      if (errors.length > 0) {
        return c.json({ status: false, message: "Validasi gagal", errors }, 400);
      }

      const [kategoriExists] = await db.select().from(kategori).where(eq(kategori.idKategori, body.idKategori));
      const [penerbitExists] = await db.select().from(penerbit).where(eq(penerbit.idPenerbit, body.idPenerbit));
      const [pembuatExists] = await db.select().from(pembuat).where(eq(pembuat.idPembuat, body.idPembuat));

      if (!kategoriExists || !penerbitExists || !pembuatExists) {
        return c.json({
          status: false,
          message: "Kategori, Penerbit, atau Pembuat tidak ditemukan",
        }, 400);
      }

      const result = await db.insert(buku).values({
        idKategori: body.idKategori,
        idPenerbit: body.idPenerbit,
        idPembuat: body.idPembuat,
        namaBuku: body.namaBuku,
        isbn: body.isbn || "",
        issn: body.issn || "",
        tahunPembuatan: body.tahunPembuatan,
        harga: body.harga,
        keterangan: body.keterangan || "",
      }).returning();

      return c.json({
        status: true,
        message: "Berhasil menambahkan buku",
        data: result[0],
      }, 201);
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal menambahkan buku",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  })

  .delete("/hapus-buku/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const [book] = await db.select().from(buku).where(eq(buku.idBuku, id));

      if (!book) {
        return c.json({ status: false, message: "Buku tidak ditemukan" }, 404);
      }

      await db.delete(buku).where(eq(buku.idBuku, id));
      return c.json({ status: true, message: "Berhasil menghapus buku" });
    } catch (error) {
      return c.json({
        status: false,
        message: "Gagal menghapus buku",
        error: error instanceof Error ? error.message : String(error),
      }, 500);
    }
  });

export default bukuRoute;
