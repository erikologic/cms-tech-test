import { PrismaClient } from "@prisma/client";

type Book = string[];

const prisma = new PrismaClient();

interface AddLayerParams {
  bookId: number;
  layerName: string;
  values: string[];
}

export async function listLayers(
  bookId: number
): Promise<{ id: number; name: string }[]> {
  const layers = await prisma.layer.findMany({
    where: {
      bookId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (layers.length === 0) {
    // Assuming we always have at least one layer per book
    throw new Error("Book not found");
  }
  return layers;
}

function validateValues(values: string[]) {
  const invalidWords = values.filter((value) => {
    if (value.length === 0 || value.length > 50) return true;
    return !/^[a-zA-Z-]+$/.test(value);
  });
  if (invalidWords.length > 0) {
    throw new Error(`Invalid words in values: "${invalidWords.join('", "')}"`);
  }
}

function validateLayerName(layerName: string) {
  if (layerName.length === 0 || layerName.length > 50) {
    throw new Error(`Invalid layer name: "${layerName}"`);
  }
  if (!/^[a-zA-Z0-9- ]+$/.test(layerName)) {
    throw new Error(`Invalid layer name: "${layerName}"`);
  }
}

export async function addLayer({
  bookId,
  layerName,
  values,
}: AddLayerParams): Promise<number> {
  if (values.length === 0 || values.length > 26) {
    throw new Error("A layer must contain between 1 and 26 values");
  }

  validateValues(values);
  validateLayerName(layerName);

  let layer;
  try {
    layer = await prisma.layer.create({
      data: {
        bookId,
        values: values.map((value) => value.toLowerCase()),
        name: layerName,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "Foreign key constraint violated: `Layer_bookId_fkey (index)`"
      )
    ) {
      throw new Error("Book not found");
    }
    throw error;
  }
  return layer.id;
}

export async function displayBookAtLayer(
  bookId: number,
  layerNumber?: number
): Promise<string[]> {
  if (layerNumber && layerNumber < 0)
    throw new Error("The layer number must be positive");

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

  if (layers.length === 0) {
    // Would be good to improve
    throw new Error(
      "Unable to solve the request for that book/layer combination"
    );
  }

  const letter2wordPairs: [string, string][] = layers
    .flatMap((layer) => layer.values)
    .map((value) => [value[0], value]);

  const finalLayer = Object.fromEntries(letter2wordPairs);
  return Object.values(finalLayer);
}

export async function generateBook(name: string): Promise<number> {
  if (name.length < 5 || name.length > 200) {
    throw new Error("Book name must be between 5 and 200 characters");
  }

  let book;
  try {
    book = await prisma.book.create({
      data: {
        name,
        layers: {
          create: {
            name: "default",
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
