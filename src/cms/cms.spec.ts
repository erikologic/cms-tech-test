/**
 * @jest-environment node
 */

import { PrismaClient } from "@prisma/client";
import {
  generateBook,
  displayBookAtLayer,
  defaultValues,
  addLayer,
} from "./cms";

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
      expect(book).toEqual(defaultValues);
    });

    test("2 books cannot have the same name", async () => {
      const name = "My test book";
      await generateBook(name);
      await expect(generateBook(name)).rejects.toThrow(
        "A book with that name already exists"
      );
    });
  });

  describe("adding layers", () => {
    test("adding a layer will update the book", async () => {
      // GIVEN we create a book
      const bookId = await generateBook("My test book");

      // WHEN we add a layer
      const layerNumber = await addLayer({
        bookId,
        layerName: "next layer",
        values: ["anchor"],
      });

      // THEN the book will have the new layer
      const bookLayers = await displayBookAtLayer(bookId);
      expect(bookLayers[0]).toEqual("anchor");
      expect(bookLayers[1]).toEqual("banana");
    });
  });
});
