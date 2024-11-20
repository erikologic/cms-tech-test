import { PrismaClient } from "@prisma/client";

type Book = string[];

const prisma = new PrismaClient();

interface AddLayerParams {
  bookId: number;
  layerName: string;
  values: string[];
}

export async function addLayer({
  bookId,
  layerName,
  // TODO test input
  values,
}: AddLayerParams): Promise<number> {
  if (values.length === 0 || values.length > 26) {
    throw new Error("A layer must contain between 1 and 26 values");
  }

  const layer = await prisma.layer.create({
    data: {
      bookId,
      values,
    },
  });
  return layer.id;
}

export async function displayBookAtLayer(
  bookId: number,
  layerNumber?: number
): Promise<string[]> {
  const layers = await prisma.layer.findMany({
    where: {
      bookId,
      id: {
        lte: layerNumber,
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  // TODO add test
  if (layers.length === 0) {
    throw new Error("Book has no layers");
  }

  const letter2wordPairs: [string, string][] = layers
    .flatMap((layer) => layer.values)
    .map((value) => [value[0], value]);

  const finalLayer = Object.fromEntries(letter2wordPairs);
  return Object.values(finalLayer);
}

export async function generateBook(name: string): Promise<number> {
  let book;
  try {
    book = await prisma.book.create({
      data: {
        name,
        layers: {
          create: {
            values: defaultValues,
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

export const defaultValues: Book = [
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
