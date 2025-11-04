-- CreateTable
CREATE TABLE "public"."MovieGenres" (
    "idMovie" INTEGER NOT NULL,
    "idGenre" INTEGER NOT NULL,

    CONSTRAINT "MovieGenres_pkey" PRIMARY KEY ("idMovie","idGenre")
);

-- AddForeignKey
ALTER TABLE "public"."MovieGenres" ADD CONSTRAINT "MovieGenres_idMovie_fkey" FOREIGN KEY ("idMovie") REFERENCES "public"."Movie"("idMovie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieGenres" ADD CONSTRAINT "MovieGenres_idGenre_fkey" FOREIGN KEY ("idGenre") REFERENCES "public"."Genre"("idGenre") ON DELETE RESTRICT ON UPDATE CASCADE;
