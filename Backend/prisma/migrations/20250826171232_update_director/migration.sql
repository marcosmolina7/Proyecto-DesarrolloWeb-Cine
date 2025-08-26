/*
  Warnings:

  - A unique constraint covering the columns `[nameDirector]` on the table `Director` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Director_nameDirector_key" ON "public"."Director"("nameDirector");
