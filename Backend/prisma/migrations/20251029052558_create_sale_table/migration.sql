-- CreateTable
CREATE TABLE "public"."Sale" (
    "idSale" SERIAL NOT NULL,
    "dateTimeSale" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("idSale")
);

-- CreateIndex
CREATE INDEX "Sale_idUser_idx" ON "public"."Sale"("idUser");

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
