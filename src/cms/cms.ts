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
    // TODO test what will happen
    throw new Error("Book not found");
  }

  return book;
}
export async function generateBook(name: string): Promise<number> {
  let book;
  try {
    book = await prisma.book.create({
      data: {
        name,
        layers: {
          createMany: {
            data: defaultBook.map((value) => ({ value })),
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed on the fields: (`name`)")
    ) {
      throw new Error("A book with that name already exists");
    }
    throw error;
  }
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
