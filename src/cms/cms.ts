type Book = string[];

export function displayBookAtLayer(bookId: number): Promise<Book> {
  return Promise.resolve(defaultBook);
}
export function generateBook(name: string): Promise<number> {
  return Promise.resolve(1);
}

export const defaultBook: Book = [
  "apple",
  "banana",
  "cat",
  "dog",
  "elephant",
  "fox",
  "goat",
  "horse",
  "iguana",
  "jaguar",
  "kangaroo",
  "lion",
  "monkey",
  "newt",
  "octopus",
  "penguin",
  "quail",
  "rabbit",
  "snake",
  "tiger",
  "unicorn",
  "vulture",
  "whale",
  "x-ray fish",
  "yak",
  "zebra",
];
