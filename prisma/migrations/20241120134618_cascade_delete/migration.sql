-- DropForeignKey
ALTER TABLE "Layer" DROP CONSTRAINT "Layer_bookId_fkey";

-- AddForeignKey
ALTER TABLE "Layer" ADD CONSTRAINT "Layer_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
