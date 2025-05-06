import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp, numeric, integer, text } from "drizzle-orm/pg-core";

// Tabel Kategori
export const kategori = pgTable("kategori", {
    idKategori: serial("id_kategori").primaryKey(),
    kodeKategori: varchar("kode_kategori", { length: 50 }).notNull(),
    namaKategori: varchar("nama_kategori", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
});

// Tabel Penerbit
export const penerbit = pgTable("penerbit", {
    idPenerbit: serial("id_penerbit").primaryKey(),
    namaPenerbit: varchar("nama_penerbit", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
});

// Tabel Pembuat
export const pembuat = pgTable("pembuat", {
    idPembuat: serial("id_pembuat").primaryKey(),
    namaPembuat: varchar("nama_pembuat", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
});

// Tabel Buku
export const buku = pgTable("buku", {
    idBuku: serial("id_buku").primaryKey(),
    idKategori: integer("id_kategori")
        .notNull()
        .references(() => kategori.idKategori, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    idPenerbit: integer("id_penerbit")
        .notNull()
        .references(() => penerbit.idPenerbit, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    idPembuat: integer("id_pembuat")
        .notNull()
        .references(() => pembuat.idPembuat, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    namaBuku: varchar("nama_buku", { length: 255 }).notNull(),
    isbn: varchar("isbn", { length: 20 }),
    issn: varchar("issn", { length: 20 }),
    tahunPembuatan: varchar("tahun_pembuatan", { length: 4 }).notNull(),
    harga: numeric("harga", { precision: 10, scale: 2 }).notNull(),
    keterangan: text("keterangan"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
});

// Relasi kategori ke buku (one-to-many)
export const relasiKategoriToBuku = relations(kategori, ({ many }) => ({
    bukuList: many(buku)
}));

// Relasi buku ke kategori (many-to-one)
export const relasiBukuToKategori = relations(buku, ({ one }) => ({
    kategori: one(kategori, {
        fields: [buku.idKategori],
        references: [kategori.idKategori]
    })
}));

// Relasi penerbit ke buku (one-to-many)
export const relasiPenerbitToBuku = relations(penerbit, ({ many }) => ({
    bukuList: many(buku)
}));

// Relasi buku ke penerbit (many-to-one)
export const relasiBukuToPenerbit = relations(buku, ({ one }) => ({
    penerbit: one(penerbit, {
        fields: [buku.idPenerbit],
        references: [penerbit.idPenerbit]
    })
}));

// Relasi pembuat ke buku (one-to-many)
export const relasiPembuatToBuku = relations(pembuat, ({ many }) => ({
    bukuList: many(buku)
}));

// Relasi buku ke pembuat (many-to-one)
export const relasiBukuToPembuat = relations(buku, ({ one }) => ({
    pembuat: one(pembuat, {
        fields: [buku.idPembuat],
        references: [pembuat.idPembuat]
    })
}));

// Export types untuk TypeScript
export type Kategori = typeof kategori.$inferSelect;
export type NewKategori = typeof kategori.$inferInsert;

export type Penerbit = typeof penerbit.$inferSelect;
export type NewPenerbit = typeof penerbit.$inferInsert;

export type Pembuat = typeof pembuat.$inferSelect;
export type NewPembuat = typeof pembuat.$inferInsert;

export type Buku = typeof buku.$inferSelect;
export type NewBuku = typeof buku.$inferInsert;