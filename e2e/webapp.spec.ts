import { test, expect } from "@playwright/test";

import { v4 as uuidv4 } from "uuid";

const withEntropy = (s: string) => `${s}-${uuidv4()}`;

test("webapp", async ({ page }) => {
  // GIVEN I load the page
  await page.goto("/");

  // When I sign up
  const user = withEntropy("alice");
  await page.getByText("Sign up").click();
  await page.getByLabel("Name").fill(user);
  await page.getByText("Submit").click();

  // AND I sign in
  await page.getByText("Sign in").click();
  await page.getByLabel("Name").fill(user);
  await page.getByText("Submit").click();

  // THEN I'm told I have no books yet
  await expect(page.getByText("No books yet")).toBeVisible();

  // WHEN I add a book
  await page.getByRole("button", { name: "Add book" }).click();
  const bookTitle = withEntropy("Alice's Adventures in Wonderland");
  await page.getByLabel("title").fill(withEntropy(bookTitle));

  // THEN I see the book in the list
  await expect(page.getByRole("cell", { name: bookTitle })).toBeVisible();

  // AND I can display see the book has been prepolulated with a default layer
  await page.getByRole("link", { name: bookTitle }).click();
  await expect(page.getByRole("cell", { name: "default" })).toBeVisible();

  // AND I can see the book content
  await page.getByRole("cell", { name: "Latest version" }).click();
  {
    const layerValues = ["alice", "bob"];
    await Promise.all(
      layerValues.map((layerValue) =>
        expect(page.getByRole("cell", { name: layerValue })).toBeVisible()
      )
    );
    // TODO count 26 values
  }

  // WHEN I add a Layer "Layer 2"
  await page.getByRole("button", { name: "Add Layer" }).click();
  await page.getByLabel("name").fill("Layer 2");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByLabel("value").fill("alpha");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByLabel("value").fill("beta");
  await page.getByRole("button", { name: "Save" }).click();

  // AND another Layer "Layer 3"
  await page.getByRole("button", { name: "Add Layer" }).click();
  await page.getByLabel("name").fill("Layer 3");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByLabel("value").fill("bravo");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByLabel("value").fill("charlie");
  await page.getByRole("button", { name: "Save" }).click();

  // THEN I can see the Layers in the book
  await Promise.all(
    ["Layer 3", "Layer 2"].map((LayerName) =>
      expect(page.getByRole("cell", { name: LayerName })).toBeVisible()
    )
  );
  // WHEN I want to see the latest book content
  await page.getByRole("button", { name: "Latest version" }).click();

  // THEN I see the content at "Layer 3"

  await Promise.all(
    ["alpha", "bravo", "charlie", "dog"].map((layerValue) =>
      expect(page.getByRole("cell", { name: layerValue })).toBeVisible()
    )
  );

  // WHEN I open the content at Layer 2
  await page.getByRole("link", { name: bookTitle }).click();
  await page.getByRole("link", { name: "Layer 2" }).click();
  {
    const layerValues = ["alpha", "beta", "cat"];
    await Promise.all(
      layerValues.map((layerValue) =>
        expect(page.getByRole("cell", { name: layerValue })).toBeVisible()
      )
    );
  }
});
