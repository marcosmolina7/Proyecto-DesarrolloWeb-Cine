-- CreateTable
CREATE TABLE "public"."Seat" (
    "idSeat" SERIAL NOT NULL,
    "rowSeat" TEXT NOT NULL,
    "columnSeat" INTEGER NOT NULL,
    "stateSeat" TEXT NOT NULL,
    "idRoom" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("idSeat")
);

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "public"."Room"("idRoom") ON DELETE RESTRICT ON UPDATE CASCADE;
