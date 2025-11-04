-- CreateTable
CREATE TABLE "public"."Products" (
    "idProduct" SERIAL NOT NULL,
    "nameProduct" TEXT NOT NULL,
    "priceProduct" DECIMAL(10,2) NOT NULL,
    "stockProduct" INTEGER NOT NULL,
    "stateProduct" BOOLEAN NOT NULL,
    "idCategorie" INTEGER NOT NULL,
    "idSize" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("idProduct")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_nameProduct_key" ON "public"."Products"("nameProduct");

-- CreateIndex
CREATE INDEX "Products_idCategorie_idx" ON "public"."Products"("idCategorie");

-- CreateIndex
CREATE INDEX "Products_idSize_idx" ON "public"."Products"("idSize");

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_idCategorie_fkey" FOREIGN KEY ("idCategorie") REFERENCES "public"."Categorie"("idCategorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_idSize_fkey" FOREIGN KEY ("idSize") REFERENCES "public"."Size"("idSize") ON DELETE RESTRICT ON UPDATE CASCADE;
