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
      const bookLayers = await displayBookAtLayer(bookId, layerNumber);
      expect(bookLayers[0]).toEqual("anchor");
      expect(bookLayers[1]).toEqual("banana");
    });

    test("a new layer must contain between 1 an 26 values", async () => {
      const bookId = await generateBook("My test book");

      await expect(
        addLayer({
          bookId,
          layerName: "next layer",
          values: [],
        })
      ).rejects.toThrow("A layer must contain between 1 and 26 values");

      await expect(
        addLayer({
          bookId,
          layerName: "next layer",
          values: Array.from({ length: 27 }, (_, i) => i.toString()),
        })
      ).rejects.toThrow("A layer must contain between 1 and 26 values");
    });
  });
});
