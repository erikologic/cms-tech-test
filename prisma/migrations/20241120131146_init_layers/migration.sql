-- CreateTable
CREATE TABLE "Layer" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Layer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Layer" ADD CONSTRAINT "Layer_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
