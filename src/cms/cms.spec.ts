/**
 * @jest-environment node
 */

import { PrismaClient } from "@prisma/client";
import {
  generateBook,
  displayBookAtLayer,
  defaultValues,
  addLayer,
  listLayers,
} from "./cms";

describe("cms", () => {
  beforeEach(async () => {
    const prisma = new PrismaClient();
    await prisma.book.deleteMany();
    await prisma.layer.deleteMany();
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
    test("adding multiple layers will return the latest view selected", async () => {
      // GIVEN we create a book
      const bookId = await generateBook("My test book");

      // WHEN we add a number layer
      const v2 = await addLayer({
        bookId,
        layerName: "layer 2",
        values: ["anchor", "hockey"],
      });

      const v3 = await addLayer({
        bookId,
        layerName: "layer 3",
        values: ["football", "tango", "zorro", "berry"],
      });

      const v4 = await addLayer({
        bookId,
        layerName: "layer 4",
        values: ["alpha", "beta", "gamma", "delta"],
      });

      const v5 = await addLayer({
        bookId,
        layerName: "layer 4",
        values: ["son", "romeo", "jolly", "mike"],
      });

      // THEN we can see the book at each layer

      // utility function to return the latest word for each letter
      const merge = (arr: string[]) =>
        Object.values(
          Object.fromEntries(arr.map((value) => [value[0], value]))
        );

      expect(await displayBookAtLayer(bookId, v2)).toEqual(
        merge([...defaultValues, "anchor", "banana", "hockey"])
      );

      expect(await displayBookAtLayer(bookId, v3)).toEqual(
        merge([
          ...defaultValues,
          "anchor",
          "banana",
          "hockey",
          "football",
          "tango",
          "zorro",
          "berry",
        ])
      );

      expect(await displayBookAtLayer(bookId, v4)).toEqual(
        merge([
          ...defaultValues,
          "hockey",
          "football",
          "tango",
          "zorro",
          "berry",
          "alpha",
          "beta",
          "gamma",
          "delta",
        ])
      );

      const latest = merge([
        ...defaultValues,
        "hockey",
        "football",
        "tango",
        "zorro",
        "berry",
        "alpha",
        "beta",
        "gamma",
        "delta",
        "son",
        "romeo",
        "jolly",
        "mike",
      ]);
      expect(await displayBookAtLayer(bookId, v5)).toEqual(latest);
      // if no layer is specified, the latest layer is returned
      expect(await displayBookAtLayer(bookId)).toEqual(latest);
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

    test("layer values must be a valid word", async () => {
      const bookId = await generateBook("My test book");

      await expect(
        addLayer({
          bookId,
          layerName: "next layer",
          values: ["", "apple", "1232", "b33z", "ski-jumping", "w@rd"],
        })
      ).rejects.toThrow('Invalid words in values: "", "1232", "b33z", "w@rd"');
    });

    test("book must be existing", async () => {
      await expect(
        addLayer({
          bookId: 123,
          layerName: "next layer",
          values: ["apple"],
        })
      ).rejects.toThrow("Book not found");
    });
  });
  
  describe("displaying layers", () => {
    test("we can display various layers of a book", async () => {
      // GIVEN we create a book
      const bookId = await generateBook("My test book");

      // WHEN we add a number layer
      const v1 = await addLayer({
        bookId,
        layerName: "layer 1",
        values: ["anchor"],
      });

      const v2 = await addLayer({
        bookId,
        layerName: "layer 2",
        values: ["hotel"],
      });

      // THEN we can list all the layers for that book
      await expect(listLayers(bookId)).resolves.toEqual([
        { id: expect.any(Number), name: "default" },
        { id: v1, name: "layer 1" },
        { id: v2, name: "layer 2" },
      ]);
    });
  });
});
