-- CreateTable
CREATE TABLE "public"."Tickets" (
    "idTicket" SERIAL NOT NULL,
    "priceTicket" DECIMAL(10,2) NOT NULL,
    "qrCodeTicket" TEXT NOT NULL,
    "idRoom" INTEGER NOT NULL,
    "idSeat" INTEGER NOT NULL,
    "idShowtime" INTEGER NOT NULL,
    "idUser" INTEGER,
    "idSale" INTEGER,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("idTicket")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_qrCodeTicket_key" ON "public"."Tickets"("qrCodeTicket");

-- CreateIndex
CREATE INDEX "Tickets_idUser_idx" ON "public"."Tickets"("idUser");

-- CreateIndex
CREATE INDEX "Tickets_idSale_idx" ON "public"."Tickets"("idSale");

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_idRoom_idSeat_idShowtime_key" ON "public"."Tickets"("idRoom", "idSeat", "idShowtime");

-- AddForeignKey
ALTER TABLE "public"."Tickets" ADD CONSTRAINT "Tickets_idRoom_idSeat_fkey" FOREIGN KEY ("idRoom", "idSeat") REFERENCES "public"."RoomSeat"("idRoom", "idSeat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tickets" ADD CONSTRAINT "Tickets_idShowtime_fkey" FOREIGN KEY ("idShowtime") REFERENCES "public"."Showtime"("idShowtime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tickets" ADD CONSTRAINT "Tickets_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tickets" ADD CONSTRAINT "Tickets_idSale_fkey" FOREIGN KEY ("idSale") REFERENCES "public"."Sale"("idSale") ON DELETE SET NULL ON UPDATE CASCADE;
