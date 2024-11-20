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

    test("book name must be decently sized", async () => {
      const generateString = (length: number) =>
        Array.from({ length }, () => "a").join("");
      await expect(generateBook(generateString(4))).rejects.toThrow(
        "Book name must be between 5 and 200 characters"
      );

      await expect(generateBook(generateString(201))).rejects.toThrow(
        "Book name must be between 5 and 200 characters"
      );
    });
  });

  describe("adding layers", () => {
    test("we can add multiple layers and display a particular view", async () => {
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
        values: ["alpha", "beta", "gamma", "delta", "mike"],
      });

      const v5 = await addLayer({
        bookId,
        layerName: "layer 4",
        values: ["son", "romeo", "jolly", "MINT"],
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
          "mike",
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
        "mint",
      ]);
      expect(await displayBookAtLayer(bookId, v5)).toEqual(latest);
      // if no layer is specified, the latest layer is returned
      expect(await displayBookAtLayer(bookId)).toEqual(latest);
    });

    describe("layer values", () => {
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

        const lengthyWord = Array.from({ length: 51 }, () => "a").join("");

        await expect(
          addLayer({
            bookId,
            layerName: "next layer",
            values: [
              "",
              "apple",
              "1232",
              "b33z",
              "ski-jumping",
              "w@rd",
              lengthyWord,
            ],
          })
        ).rejects.toThrow(
          `Invalid words in values: "", "1232", "b33z", "w@rd", "${lengthyWord}"`
        );
      });
    });

    test("book must be existing", async () => {
      await expect(
        addLayer({
          bookId: 123,
          layerName: "next layer",
          values: ["apple"],
        })
      ).rejects.toThrow("Book not found");

      await expect(displayBookAtLayer(123)).rejects.toThrow(
        "Unable to solve the request for that book/layer combination"
      );
    });

    test("layer number must be valid", async () => {
      const bookId = await generateBook("My test book");
      const layerNumber = await addLayer({
        bookId,
        layerName: "layer",
        values: ["alpha", "beta", "gamma", "delta", "mike"],
      });

      const anotherBookId = await generateBook("Another book");

      await expect(
        displayBookAtLayer(anotherBookId, layerNumber)
      ).rejects.toThrow(
        "Unable to solve the request for that book/layer combination"
      );

      await expect(displayBookAtLayer(anotherBookId, -1)).rejects.toThrow(
        "The layer number must be positive"
      );
    });

    describe("layer name", () => {
      const lengthyWord = Array.from({ length: 51 }, () => "a").join("");
      const wrongNames = ["", "w@rd", lengthyWord];
      test.each(wrongNames)(`"%s" is not a valid layer name`, async (name) => {
        const bookId = await generateBook("My test book");
        await expect(
          addLayer({
            bookId,
            layerName: name,
            values: ["apple"],
          })
        ).rejects.toThrow(`Invalid layer name: "${name}"`);
      });
    });
  });

  describe("displaying layers", () => {
    test("we can list all the layers of a book", async () => {
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
        { id: v2, name: "layer 2" },
        { id: v1, name: "layer 1" },
        { id: expect.any(Number), name: "default" },
      ]);
    });

    test("book must be existing", async () => {
      await expect(listLayers(123)).rejects.toThrow("Book not found");
    });
  });
});
