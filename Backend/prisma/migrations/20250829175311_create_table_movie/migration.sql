-- CreateTable
CREATE TABLE "public"."Movie" (
    "idMovie" SERIAL NOT NULL,
    "nameMovie" TEXT NOT NULL,
    "durationMovie" INTEGER NOT NULL,
    "synapsisMovie" TEXT NOT NULL,
    "realseDateMovie" TIMESTAMP(3) NOT NULL,
    "posterMovie" TEXT NOT NULL,
    "idDirector" INTEGER NOT NULL,
    "idAgeRating" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("idMovie")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_nameMovie_key" ON "public"."Movie"("nameMovie");

-- AddForeignKey
ALTER TABLE "public"."Movie" ADD CONSTRAINT "Movie_idDirector_fkey" FOREIGN KEY ("idDirector") REFERENCES "public"."Director"("idDirector") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movie" ADD CONSTRAINT "Movie_idAgeRating_fkey" FOREIGN KEY ("idAgeRating") REFERENCES "public"."AgeRating"("idAgeRating") ON DELETE RESTRICT ON UPDATE CASCADE;
