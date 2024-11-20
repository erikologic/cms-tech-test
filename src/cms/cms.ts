import { PrismaClient } from "@prisma/client";

type Book = string[];

const prisma = new PrismaClient();

export async function displayBookAtLayer(id: number) {
  const book = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      layers: true,
    },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}
export async function generateBook(name: string): Promise<number> {
  const book = await prisma.book.create({
    data: {
      name,
      layers: {
        createMany: {
          data: defaultBook.map((value) => ({ value })),
        },
      },
    },
  });
  return book.id;
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
