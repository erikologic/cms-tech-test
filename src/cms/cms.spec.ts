import { generateBook, displayBookAtLayer, defaultBook } from "./cms";


describe("cms", () => {
  test("generating a book return the default book", async () => {
    const name = "My first book";
    const bookId = await generateBook(name);
    const book = await displayBookAtLayer(bookId);
    expect(book).toEqual(defaultBook);
  });
});
