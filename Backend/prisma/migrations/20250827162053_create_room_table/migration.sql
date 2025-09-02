-- CreateTable
CREATE TABLE "public"."Room" (
    "idRoom" SERIAL NOT NULL,
    "nameRoom" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("idRoom")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_nameRoom_key" ON "public"."Room"("nameRoom");
