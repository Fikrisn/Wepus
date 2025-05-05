import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const books = pgTable('books', {
  id: serial('id').primaryKey(),                          // ID otomatis
  title: text('title').notNull(),                         // Nama buku
  category: text('category').notNull(),                   // Kategori buku
  publisher: text('publisher').notNull(),                 // Penerbit
  isbn: text('isbn').notNull(),                           // ISBN
  issn: text('issn'),                                     // ISSN (opsional)
  author: text('author').notNull(),                       // Pembuat / Penulis
  year: integer('year').notNull(),                        // Tahun pembuatan
  price: integer('price').notNull(),                      // Harga
  description: text('description'),                       // Keterangan (opsional)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(), // Timestamp
});
