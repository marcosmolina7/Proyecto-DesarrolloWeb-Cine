-- CreateTable
CREATE TABLE "public"."Categorie" (
    "idCategorie" SERIAL NOT NULL,
    "nameCategorie" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("idCategorie")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categorie_nameCategorie_key" ON "public"."Categorie"("nameCategorie");
