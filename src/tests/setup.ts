import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Set test environment
process.env.NODE_ENV = 'test';

/**
 * Validates that we're using a test database
 * Prevents accidental data loss in development or production databases
 */
function validateTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      '❌ DATABASE_URL not found. Make sure .env.test exists and is loaded.'
    );
  }

  // Check if database name contains 'test'
  const dbNameMatch = databaseUrl.match(/\/([^/?]+)(?:\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : '';

  if (!dbName?.includes('test')) {
    throw new Error(
      `❌ SAFETY CHECK FAILED: Database "${dbName}" does not contain "test" in its name.\n` +
        `Tests can only run against test databases to prevent data loss.\n` +
        `Current DATABASE_URL: ${databaseUrl}\n` +
        `Expected database name to include "test" (e.g., "evachild_test")`
    );
  }

  console.log(`✅ Safety check passed: Using test database "${dbName}"\n`);
}

beforeAll(async () => {
  // Validate database before connecting
  validateTestDatabase();

  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

// Optional: Clean database between tests
beforeEach(async () => {
  // Add cleanup logic here if needed
  // Example: await prisma.user.deleteMany({});
});

export { prisma };
