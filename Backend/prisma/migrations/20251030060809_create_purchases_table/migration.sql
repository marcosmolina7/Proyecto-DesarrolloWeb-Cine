-- CreateTable
CREATE TABLE "public"."Purchases" (
    "idPurchase" SERIAL NOT NULL,
    "datePurchase" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "idSupplier" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("idPurchase")
);

-- AddForeignKey
ALTER TABLE "public"."Purchases" ADD CONSTRAINT "Purchases_idSupplier_fkey" FOREIGN KEY ("idSupplier") REFERENCES "public"."Supplier"("idSupplier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchases" ADD CONSTRAINT "Purchases_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
