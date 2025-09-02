-- CreateTable
CREATE TABLE "public"."Size" (
    "idSize" SERIAL NOT NULL,
    "nameSize" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("idSize")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_nameSize_key" ON "public"."Size"("nameSize");
