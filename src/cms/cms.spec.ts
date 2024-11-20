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
  createUser,
} from "./cms";

const generateString = (length: number) =>
  Array.from({ length }, () => "a").join("");
const lengthyWord = generateString(51);

describe("cms", () => {
  beforeEach(async () => {
    const prisma = new PrismaClient();
    await prisma.user.deleteMany();
    await prisma.book.deleteMany();
    await prisma.layer.deleteMany();
  });

  describe("one user", () => {
    let userId: number;
    beforeEach(async () => {
      userId = await createUser("alice");

      const bob = await createUser("bob");
      const bobBook = await generateBook({ name: "Bob's book", userId: bob });
      await addLayer({
        userId: bob,
        bookId: bobBook,
        layerName: "layer 2",
        values: ["apple", "banana"],
      });
    });

    describe("generating books", () => {
      test("generating a book return the default book", async () => {
        const name = "My test book";
        const bookId = await generateBook({ name, userId });
        const book = await displayBookAtLayer({ userId, bookId });
        expect(book).toEqual(defaultValues);
      });

      test("2 books cannot have the same name", async () => {
        const name = "My test book";
        await generateBook({ name, userId });
        await expect(generateBook({ name, userId })).rejects.toThrow(
          "A book with that name already exists"
        );
      });

      test("book name must be decently sized", async () => {
        await expect(
          generateBook({ name: generateString(4), userId })
        ).rejects.toThrow("Book name must be between 5 and 200 characters");

        await expect(
          generateBook({ name: generateString(201), userId })
        ).rejects.toThrow("Book name must be between 5 and 200 characters");
      });
    });

    describe("adding layers", () => {
      test("we can add multiple layers and display a particular view", async () => {
        // GIVEN we create a book
        const bookId = await generateBook({ name: "My test book", userId });

        // WHEN we add a number layer
        const v2 = await addLayer({
          userId,
          bookId,
          layerName: "layer 2",
          values: ["anchor", "hockey"],
        });

        const v3 = await addLayer({
          userId,
          bookId,
          layerName: "layer 3",
          values: ["football", "tango", "zorro", "berry"],
        });

        const v4 = await addLayer({
          userId,
          bookId,
          layerName: "layer 4",
          values: ["alpha", "beta", "gamma", "delta", "mike"],
        });

        const v5 = await addLayer({
          userId,
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

        expect(
          await displayBookAtLayer({ userId, bookId, layerNumber: v2 })
        ).toEqual(merge([...defaultValues, "anchor", "banana", "hockey"]));

        expect(
          await displayBookAtLayer({ userId, bookId, layerNumber: v3 })
        ).toEqual(
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

        expect(
          await displayBookAtLayer({ userId, bookId, layerNumber: v4 })
        ).toEqual(
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
        expect(
          await displayBookAtLayer({ userId, bookId, layerNumber: v5 })
        ).toEqual(latest);
        // if no layer is specified, the latest layer is returned
        expect(await displayBookAtLayer({ userId, bookId })).toEqual(latest);
      });

      describe("layer values", () => {
        test("a new layer must contain between 1 an 26 values", async () => {
          const bookId = await generateBook({ name: "My test book", userId });

          await expect(
            addLayer({
              userId,
              bookId,
              layerName: "next layer",
              values: [],
            })
          ).rejects.toThrow("A layer must contain between 1 and 26 values");

          await expect(
            addLayer({
              userId,
              bookId,
              layerName: "next layer",
              values: Array.from({ length: 27 }, (_, i) => i.toString()),
            })
          ).rejects.toThrow("A layer must contain between 1 and 26 values");
        });

        test("layer values must be a valid word", async () => {
          const bookId = await generateBook({ name: "My test book", userId });

          await expect(
            addLayer({
              userId,
              bookId,
              layerName: "next layer",
              values: [
                "",
                "apple",
                "1232",
                "b33z",
                "ski-jumping",
                "w@rd",
                generateString(51),
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
            userId,
            bookId: 123,
            layerName: "next layer",
            values: ["apple"],
          })
        ).rejects.toThrow("Book not found");

        await expect(
          displayBookAtLayer({ userId, bookId: 123 })
        ).rejects.toThrow(
          "Unable to solve the request for that book/layer combination"
        );
      });

      test("layer number must be valid", async () => {
        const bookId = await generateBook({ name: "My test book", userId });
        const layerNumber = await addLayer({
          userId,
          bookId,
          layerName: "layer",
          values: ["alpha", "beta", "gamma", "delta", "mike"],
        });

        const anotherBookId = await generateBook({
          name: "Another book",
          userId,
        });

        await expect(
          displayBookAtLayer({ userId, bookId: anotherBookId, layerNumber })
        ).rejects.toThrow(
          "Unable to solve the request for that book/layer combination"
        );

        await expect(
          displayBookAtLayer({ userId, bookId, layerNumber: -1 })
        ).rejects.toThrow("The layer number must be positive");
      });

      describe("layer name", () => {
        const wrongNames = ["", "w@rd", generateString(51)];
        test.each(wrongNames)(
          `"%s" is not a valid layer name`,
          async (name) => {
            const bookId = await generateBook({ name: "My test book", userId });
            await expect(
              addLayer({
                userId,
                bookId,
                layerName: name,
                values: ["apple"],
              })
            ).rejects.toThrow(`Invalid layer name: "${name}"`);
          }
        );
      });
    });

    describe("displaying layers", () => {
      test("we can list all the layers of a book", async () => {
        // GIVEN we create a book
        const bookId = await generateBook({ name: "My test book", userId });

        // WHEN we add a number layer
        const v1 = await addLayer({
          userId,
          bookId,
          layerName: "layer 1",
          values: ["anchor"],
        });

        const v2 = await addLayer({
          userId,
          bookId,
          layerName: "layer 2",
          values: ["hotel"],
        });

        // THEN we can list all the layers for that book
        await expect(listLayers({ bookId, userId })).resolves.toEqual([
          { id: v2, name: "layer 2" },
          { id: v1, name: "layer 1" },
          { id: expect.any(Number), name: "default" },
        ]);
      });

      test("book must be existing", async () => {
        await expect(listLayers({ bookId: 123, userId })).rejects.toThrow(
          "Book not found"
        );
      });
    });
  });

  describe("multiple users", () => {
    test("users cannot operate on other users' books", async () => {
      // GIVEN 2 users
      const aliceId = await createUser("alice");
      const bobId = await createUser("bob");

      // WHEN alice creates a book
      const bookId = await generateBook({
        name: "My test book",
        userId: aliceId,
      });

      // THEN bob cannot add a layer to alice's book
      await expect(
        addLayer({
          bookId,
          layerName: "next layer",
          values: ["apple"],
          userId: bobId,
        })
      ).rejects.toThrow("Book not found");

      // AND bob cannot list alive's book layers
      await expect(listLayers({ bookId, userId: bobId })).rejects.toThrow(
        "Book not found"
      );

      // AND bob cannot display alice's book
      await expect(
        displayBookAtLayer({ bookId, userId: bobId })
      ).rejects.toThrow(
        "Unable to solve the request for that book/layer combination"
      );
    });

    describe("user name", () => {
      test.each(["", generateString(2), lengthyWord, ":@"])(
        '"%s" user name is not be valid',
        async (name) => {
          await expect(createUser(name)).rejects.toThrow("Invalid user name");
        }
      );

      test("user name must be unique", async () => {
        await createUser("alice");
        await expect(createUser("alice")).rejects.toThrow(
          "A user with that name already exists"
        );
      });
    });
  });
});
