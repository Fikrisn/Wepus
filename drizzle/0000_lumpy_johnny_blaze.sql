CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"publisher" text NOT NULL,
	"isbn" text NOT NULL,
	"issn" text,
	"author" text NOT NULL,
	"year" integer NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
