import { Prisma, PrismaClient } from '@prisma/client';
import prisma from './prisma';

type Book = string[];

export const defaultValues: Book = [
	'apple',
	'banana',
	'cat',
	'dog',
	'elephant',
	'fox',
	'goat',
	'horse',
	'iguana',
	'jaguar',
	'kangaroo',
	'lion',
	'monkey',
	'newt',
	'octopus',
	'penguin',
	'quail',
	'rabbit',
	'snake',
	'tiger',
	'unicorn',
	'vulture',
	'whale',
	'x-ray fish',
	'yak',
	'zebra',
];

interface ListBooksProps {
	userId: number;
}
export async function listBooks({
	userId,
}: ListBooksProps): Promise<{ id: number; name: string }[]> {
	const books = await prisma.book.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			id: 'desc',
		},
	});
	return books;
}

interface GetBookProps {
	bookId: number;
	userId: number;
}
export async function getBook({
	userId,
	bookId,
}: GetBookProps): Promise<{ id: number; name: string }> {
	const book = await prisma.book.findFirst({
		where: {
			id: bookId,
			userId,
		},
		select: {
			id: true,
			name: true,
		},
	});
	if (!book) {
		throw new Error('Book not found');
	}
	return book;
}

interface ListLayersParams {
	bookId: number;
	userId: number;
}
export async function listLayers({
	bookId,
	userId,
}: ListLayersParams): Promise<{ id: number; name: string }[]> {
	const layers = await prisma.layer.findMany({
		where: {
			Book: {
				AND: {
					id: bookId,
					userId,
				},
			},
		},
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			id: 'desc',
		},
	});

	if (layers.length === 0) {
		// Assuming we always have at least one layer per book
		throw new Error('Book not found');
	}
	return layers;
}

function _validateValues(values: string[]) {
	const invalidWords = values.filter(value => {
		if (value.length === 0 || value.length > 50) return true;
		return !/^[a-zA-Z-]+$/.test(value);
	});
	if (invalidWords.length > 0) {
		throw new Error(
			`Invalid words in values: "${invalidWords.join('", "')}"`,
		);
	}
}

function _validateLayerName(layerName: string) {
	if (layerName.length === 0 || layerName.length > 50) {
		throw new Error(`Invalid layer name: "${layerName}"`);
	}
	if (!/^[a-zA-Z0-9- ]+$/.test(layerName)) {
		throw new Error(`Invalid layer name: "${layerName}"`);
	}
}

interface AddLayerParams {
	userId: number;
	bookId: number;
	layerName: string;
	values: string[];
}

export async function addLayer({
	bookId,
	layerName,
	values,
	userId,
}: AddLayerParams): Promise<number> {
	if (values.length === 0 || values.length > 26) {
		throw new Error('A layer must contain between 1 and 26 values');
	}

	_validateValues(values);
	_validateLayerName(layerName);

	let layer;
	try {
		layer = await prisma.layer.create({
			data: {
				Book: {
					connect: {
						id: bookId,
						userId,
					},
				},
				values: values.map(value => value.toLowerCase()),
				name: layerName,
			},
		});
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error)) throw error;
		if (error.code === 'P2025') {
			throw new Error('Book not found');
		}
		throw error;
	}
	return layer.id;
}

interface DisplayBookAtLayerParams {
	bookId: number;
	userId: number;
	layerNumber?: number;
}

export async function displayBookAtLayer({
	bookId,
	userId,
	layerNumber,
}: DisplayBookAtLayerParams): Promise<string[]> {
	if (layerNumber && layerNumber < 0)
		throw new Error('The layer number must be positive');

	const layers = await prisma.layer.findMany({
		where: {
			Book: {
				AND: {
					id: bookId,
					userId,
				},
			},
			id: {
				lte: layerNumber ? layerNumber : Prisma.skip,
			},
		},
		orderBy: {
			id: 'asc',
		},
	});

	if (layers.length === 0) {
		// Would be good to improve
		throw new Error(
			'Unable to solve the request for that book/layer combination',
		);
	}

	const letter2wordPairs: [string, string][] = layers
		.flatMap(layer => layer.values)
		.map(value => [value[0], value]);

	const finalLayer = Object.fromEntries(letter2wordPairs);
	return Object.values(finalLayer);
}

interface GenerateBookParams {
	name: string;
	userId: number;
}
export async function generateBook({
	name,
	userId,
}: GenerateBookParams): Promise<number> {
	if (name.length < 5 || name.length > 200) {
		throw new Error('Book name must be between 5 and 200 characters');
	}

	let book;
	try {
		book = await prisma.book.create({
			data: {
				name,
				userId,
				layers: {
					create: {
						name: 'default',
						values: defaultValues,
					},
				},
			},
		});
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes(
				'Unique constraint failed on the fields: (`name`)',
			)
		) {
			throw new Error('A book with that name already exists');
		}
		throw error;
	}
	return book.id;
}

function _validateUserName(name: string) {
	if (name.length < 3 || name.length > 50 || !/^[a-zA-Z0-9- ]+$/.test(name)) {
		throw new Error(`Invalid user name: "${name}"`);
	}
}

export async function createUser(name: string): Promise<number> {
	_validateUserName(name);
	let user;
	try {
		user = await prisma.user.create({
			data: {
				name,
			},
		});
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes(
				'Unique constraint failed on the fields: (`name`)',
			)
		) {
			throw new Error('A user with that name already exists');
		}
		throw error;
	}
	return user.id;
}

export async function getUserId(name: string): Promise<number> {
	const user = await prisma.user.findUnique({
		where: {
			name,
		},
	});
	if (!user) {
		throw new Error('User not found');
	}
	return user.id;
}
