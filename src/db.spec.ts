/**
 * @jest-environment node
 */

import { PrismaClient } from "@prisma/client";

describe("database", () => {
  test("connection", async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();
  });
});
