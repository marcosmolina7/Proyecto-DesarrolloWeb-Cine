-- CreateTable
CREATE TABLE "public"."Role" (
    "idRole" SERIAL NOT NULL,
    "nameRole" TEXT NOT NULL,
    "descriptionRole" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("idRole")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "idUser" SERIAL NOT NULL,
    "nameUser" TEXT NOT NULL,
    "passUser" TEXT NOT NULL,
    "idRole" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nameRole_key" ON "public"."Role"("nameRole");

-- CreateIndex
CREATE UNIQUE INDEX "User_nameUser_key" ON "public"."User"("nameUser");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "public"."Role"("idRole") ON DELETE RESTRICT ON UPDATE CASCADE;
