-- CreateTable
CREATE TABLE "public"."ProductsSale" (
    "idSale" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ProductsSale_pkey" PRIMARY KEY ("idSale","idProduct")
);

-- CreateIndex
CREATE INDEX "ProductsSale_idProduct_idx" ON "public"."ProductsSale"("idProduct");

-- AddForeignKey
ALTER TABLE "public"."ProductsSale" ADD CONSTRAINT "ProductsSale_idSale_fkey" FOREIGN KEY ("idSale") REFERENCES "public"."Sale"("idSale") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductsSale" ADD CONSTRAINT "ProductsSale_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "public"."Products"("idProduct") ON DELETE RESTRICT ON UPDATE CASCADE;
