/**
 * @jest-environment node
 */

import { PrismaClient } from "@prisma/client";
import { generateBook, displayBookAtLayer, defaultBook } from "./cms";

describe("cms", () => {
  beforeEach(async () => {
    const prisma = new PrismaClient();
    await prisma.book.deleteMany();
  });

  describe("generating books", () => {
    test("generating a book return the default book", async () => {
      const name = "My test book";
      const bookId = await generateBook(name);
      const book = await displayBookAtLayer(bookId);
      expect(book).toEqual({
        id: bookId,
        name,
        layers: defaultBook.map((value) => expect.objectContaining({ value })),
      });
    });

    test("2 books cannot have the same name", async () => {
      const name = "My test book";
      await generateBook(name);
      await expect(generateBook(name)).rejects.toThrow(
        "A book with that name already exists"
      );
    });
  });
});
