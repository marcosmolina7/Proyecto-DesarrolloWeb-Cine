-- CreateTable
CREATE TABLE "public"."Supplier" (
    "idSupplier" SERIAL NOT NULL,
    "nameSupplier" TEXT NOT NULL,
    "contactPersonSupplier" TEXT NOT NULL,
    "phoneSupplier" TEXT NOT NULL,
    "emailSupplier" TEXT NOT NULL,
    "addressSupplier" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("idSupplier")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_nameSupplier_key" ON "public"."Supplier"("nameSupplier");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_emailSupplier_key" ON "public"."Supplier"("emailSupplier");
