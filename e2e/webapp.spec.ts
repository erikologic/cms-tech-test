import { test, expect } from "@playwright/test";

test("webapp", async ({ page }) => {
  // GIVEN I load the page
  await page.goto("/");

  // AND I signup
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("name").fill("Alice");

  // THEN I'm told I have no books yet
  await expect(page.getByText("No books yet")).toBeVisible();

  // WHEN I add a book
  await page.getByRole("button", { name: "Add book" }).click();
  await page.getByPlaceholder("title").fill("Alice's Adventures in Wonderland");

  // THEN I see the book in the list
  await expect(
    page.getByRole("cell", { name: "Alice's Adventures in Wonderland" })
  ).toBeVisible();

  // AND I can display see the book has been prepolulated with a default layer
  await page
    .getByRole("link", { name: "Alice's Adventures in Wonderland" })
    .click();
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
    // can I count that there are 26 cells?
  }

  // WHEN I add a Layer "Layer 2"
  await page.getByRole("button", { name: "Add Layer" }).click();
  await page.getByPlaceholder("name").fill("Layer 2");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByPlaceholder("value").fill("alpha");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByPlaceholder("value").fill("beta");
  await page.getByRole("button", { name: "Save" }).click();

  // AND another Layer "Layer 3"
  await page.getByRole("button", { name: "Add Layer" }).click();
  await page.getByPlaceholder("name").fill("Layer 3");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByPlaceholder("value").fill("bravo");
  await page.getByRole("button", { name: "Add value" }).click();
  await page.getByPlaceholder("value").fill("charlie");
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
  await page
    .getByRole("link", { name: "Alice's Adventures in Wonderland" })
    .click();
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
