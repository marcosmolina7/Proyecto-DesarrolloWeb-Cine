-- CreateTable
CREATE TABLE "public"."Employee" (
    "idEmployee" SERIAL NOT NULL,
    "namesEmployee" TEXT NOT NULL,
    "lastNamesEmployee" TEXT NOT NULL,
    "phoneEmployee" TEXT NOT NULL,
    "birthdayEmployee" TIMESTAMP(3) NOT NULL,
    "stateEmployee" BOOLEAN NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("idEmployee")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_idUser_key" ON "public"."Employee"("idUser");

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
