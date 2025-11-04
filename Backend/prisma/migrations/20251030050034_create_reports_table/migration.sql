-- CreateTable
CREATE TABLE "public"."Reports" (
    "idReport" SERIAL NOT NULL,
    "dateReport" DATE NOT NULL,
    "typeReport" TEXT NOT NULL,
    "parametersReport" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("idReport")
);

-- CreateIndex
CREATE INDEX "Reports_idUser_idx" ON "public"."Reports"("idUser");

-- AddForeignKey
ALTER TABLE "public"."Reports" ADD CONSTRAINT "Reports_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
