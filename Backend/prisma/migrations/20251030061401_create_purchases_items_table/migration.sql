-- CreateTable
CREATE TABLE "public"."PurchasesItems" (
    "idPurchase" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PurchasesItems_pkey" PRIMARY KEY ("idPurchase","idProduct")
);

-- AddForeignKey
ALTER TABLE "public"."PurchasesItems" ADD CONSTRAINT "PurchasesItems_idPurchase_fkey" FOREIGN KEY ("idPurchase") REFERENCES "public"."Purchases"("idPurchase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchasesItems" ADD CONSTRAINT "PurchasesItems_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "public"."Products"("idProduct") ON DELETE RESTRICT ON UPDATE CASCADE;
