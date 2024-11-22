import { test, expect } from '@playwright/test';

import { v4 as uuidv4 } from 'uuid';

const withEntropy = (s: string) => `${s}-${uuidv4()}`;

test('webapp', async ({ page }) => {
	// GIVEN I load the page
	await page.goto('/');
	await expect(page.getByText('CMS')).toBeVisible();

	// When I sign up
	const user = withEntropy('alice');
	await page.getByRole('link', { name: 'Sign up' }).click();
	await page.getByLabel('Name').fill(user);
	await page.getByRole('button', { name: 'Sign up' }).click();

	// AND I sign in
	await page.getByText('Sign in').click();
	await page.getByLabel('Name').fill(user);
	await page.getByRole('button', { name: 'Sign in' }).click();

	// THEN I'm told I have no books yet
	// TODO display name
	await expect(page.getByText('No books yet')).toBeVisible();

	// WHEN I add a book
	await page.getByRole('link', { name: 'Add book' }).click();
	await expect(page.getByText('Add book')).toBeVisible();
	const bookTitle = withEntropy("Alice's Adventures in Wonderland");
	await page.getByLabel('name').fill(bookTitle);
	await page.getByRole('button', { name: 'Create' }).click();

	// THEN I see the book in the list
	await expect(page.getByText(bookTitle)).toBeVisible();

	// AND I can display see the book has been prepolulated with a default layer
	await page.getByRole('link', { name: bookTitle }).click();
	await expect(page.getByText('default')).toBeVisible();

	// AND I can see the book content
	await page.getByRole('link', { name: 'Show latest book version' }).click();
	await expect(page.getByText('Book content')).toBeVisible();
	{
		const layerValues = ['apple', 'banana'];
		await Promise.all(
			layerValues.map(layerValue =>
				expect(page.getByText(layerValue)).toBeVisible(),
			),
		);
		// TODO count 26 values
	}

	// WHEN I add a Layer "Layer 2"
	await page.getByText('Back to Layers').click();
	await page.getByRole('link', { name: 'Add layer' }).click();

	await page.getByRole('button', { name: 'Add value' }).click();
	await page.getByLabel('Name').fill('Layer 2');
	await page.getByLabel('Value').fill('alpha');
	await page.getByRole('button', { name: 'Add value' }).click();
	await page.getByLabel('Value').nth(1).fill('beta');
	await page.getByRole('button', { name: 'Save' }).click();

	// AND another Layer "Layer 3"
	await page.getByRole('link', { name: 'Back to Layers' }).click();
	await page.getByRole('link', { name: 'Add layer' }).click();

	await page.getByLabel('Name').fill('Layer 3');
	await page.getByRole('button', { name: 'Add value' }).click();
	await page.getByLabel('Value').fill('bravo');
	await page.getByRole('button', { name: 'Add value' }).click();
	await page.getByLabel('Value').nth(1).fill('charlie');
	await page.getByRole('button', { name: 'Save' }).click();

	// THEN I can see the Layers in the book
	await page.getByRole('link', { name: 'Back to Layers' }).click();
	await Promise.all(
		['Layer 3', 'Layer 2'].map(layerName =>
			expect(page.getByText(layerName)).toBeVisible(),
		),
	);

	// WHEN I want to see the latest book content
	await page.getByRole('link', { name: 'Show latest book version' }).click();

	// THEN I see the content at "Layer 3"
	await Promise.all(
		['alpha', 'bravo', 'charlie', 'dog'].map(layerValue =>
			expect(page.getByText(layerValue)).toBeVisible(),
		),
	);

	// WHEN I open the content at Layer 2
	await page.getByRole('link', { name: 'Back to Layers' }).click();
	await page.getByRole('link', { name: 'Layer 2' }).click();
	await Promise.all(
		['alpha', 'beta', 'cat', 'dog'].map(layerValue =>
			expect(page.getByText(layerValue)).toBeVisible(),
		),
	);

	// AND I can log out
	await page.getByRole('link', { name: 'Back to Layers' }).click();
	await page.getByRole('link', { name: 'Back to Books' }).click();
	await page.getByRole('link', { name: 'Sign out' }).click();
	await expect(page.getByText('CMS')).toBeVisible();
});
