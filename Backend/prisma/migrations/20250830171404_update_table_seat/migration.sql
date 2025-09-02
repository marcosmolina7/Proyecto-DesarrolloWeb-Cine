-- DropForeignKey
ALTER TABLE "public"."Seat" DROP CONSTRAINT "Seat_idRoom_fkey";

-- AlterTable
ALTER TABLE "public"."Seat" ALTER COLUMN "idRoom" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "public"."Room"("idRoom") ON DELETE SET NULL ON UPDATE CASCADE;
