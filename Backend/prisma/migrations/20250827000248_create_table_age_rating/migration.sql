-- CreateTable
CREATE TABLE "public"."AgeRating" (
    "idAgeRating" SERIAL NOT NULL,
    "nameAgeRating" TEXT NOT NULL,
    "descAgeRating" TEXT NOT NULL,

    CONSTRAINT "AgeRating_pkey" PRIMARY KEY ("idAgeRating")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgeRating_nameAgeRating_key" ON "public"."AgeRating"("nameAgeRating");

-- CreateIndex
CREATE UNIQUE INDEX "AgeRating_descAgeRating_key" ON "public"."AgeRating"("descAgeRating");
