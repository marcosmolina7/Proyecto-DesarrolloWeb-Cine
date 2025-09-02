/*
  Warnings:

  - You are about to drop the column `idRoom` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `stateSeat` on the `Seat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Seat" DROP CONSTRAINT "Seat_idRoom_fkey";

-- DropIndex
DROP INDEX "public"."Room_nameRoom_key";

-- AlterTable
ALTER TABLE "public"."Seat" DROP COLUMN "idRoom",
DROP COLUMN "stateSeat";

-- CreateTable
CREATE TABLE "public"."RoomSeat" (
    "idRoom" INTEGER NOT NULL,
    "idSeat" INTEGER NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "RoomSeat_pkey" PRIMARY KEY ("idRoom","idSeat")
);

-- AddForeignKey
ALTER TABLE "public"."RoomSeat" ADD CONSTRAINT "RoomSeat_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "public"."Room"("idRoom") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomSeat" ADD CONSTRAINT "RoomSeat_idSeat_fkey" FOREIGN KEY ("idSeat") REFERENCES "public"."Seat"("idSeat") ON DELETE RESTRICT ON UPDATE CASCADE;
