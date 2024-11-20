/**
 * @jest-environment node
 */

import { generateBook, displayBookAtLayer, defaultBook } from "./cms";

describe("cms", () => {
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
});
