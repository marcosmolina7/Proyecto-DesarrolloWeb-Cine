-- CreateTable
CREATE TABLE "public"."Genre" (
    "idGenre" SERIAL NOT NULL,
    "nameGenre" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("idGenre")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_nameGenre_key" ON "public"."Genre"("nameGenre");
