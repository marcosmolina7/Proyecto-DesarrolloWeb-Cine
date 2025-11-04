-- CreateTable
CREATE TABLE "public"."Showtime" (
    "idShowtime" SERIAL NOT NULL,
    "dateTimeShowtime" TIMESTAMP(3) NOT NULL,
    "idRoom" INTEGER NOT NULL,
    "idMovie" INTEGER NOT NULL,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("idShowtime")
);

-- CreateIndex
CREATE INDEX "Showtime_idRoom_dateTimeShowtime_idx" ON "public"."Showtime"("idRoom", "dateTimeShowtime");

-- CreateIndex
CREATE INDEX "Showtime_idMovie_idx" ON "public"."Showtime"("idMovie");

-- AddForeignKey
ALTER TABLE "public"."Showtime" ADD CONSTRAINT "Showtime_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "public"."Room"("idRoom") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Showtime" ADD CONSTRAINT "Showtime_idMovie_fkey" FOREIGN KEY ("idMovie") REFERENCES "public"."Movie"("idMovie") ON DELETE RESTRICT ON UPDATE CASCADE;
