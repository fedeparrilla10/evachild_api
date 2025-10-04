import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

/**
 * Clean up all tables in the database
 * Use with caution - only in test environment
 */
export async function cleanDatabase() {
  // Safety check 1: Verify NODE_ENV
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "❌ SECURITY BLOCK: cleanDatabase can only be used in test environment.\n" +
        `Current NODE_ENV: ${process.env.NODE_ENV}`
    );
  }

  // Safety check 2: Verify database name contains 'test'
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("❌ DATABASE_URL not found");
  }

  const dbNameMatch = databaseUrl.match(/\/([^/?]+)(?:\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : "";

  if (!dbName?.includes("test")) {
    throw new Error(
      `❌ SECURITY BLOCK: Refusing to clean database "${dbName}".\n` +
        `This function only works with databases containing "test" in their name.\n` +
        `Current database: ${dbName}`
    );
  }

  const tablenames = await prisma.$queryRaw<
    Array<{ TABLE_NAME: string }>
  >`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`;

  const tables = tablenames
    .map(({ TABLE_NAME }) => TABLE_NAME)
    .filter((name) => name !== "_prisma_migrations");

  try {
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);

    for (const name of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${name}\``);
    }

    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
  } catch (error) {
    console.error("Error cleaning database:", error);
    throw error;
  }
}

// Counter for unique role names in tests
let roleCounter = 0;

/**
 * Create a test role helper
 */
export async function createTestRole(name?: string) {
  const roleName = name || `Tester-${++roleCounter}`;

  return await prisma.role.create({
    data: {
      name: roleName,
    },
  });
}

/**
 * Create a test user helper
 */
export async function createTestUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id?: number;
}) {
  // Ensure a default role exists if no role_id is provided
  let roleId = data.role_id;
  if (!roleId) {
    const defaultRole = await prisma.role.findFirst();
    if (!defaultRole) {
      const newRole = await createTestRole();
      roleId = newRole.id;
    } else {
      roleId = defaultRole.id;
    }
  }

  return await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      role_id: roleId,
    },
  });
}

/**
 * Create a test class helper
 */
export async function createTestClass(data?: {
  name?: string;
  min_age?: number;
  max_age?: number;
}) {
  return await prisma.class.create({
    data: {
      name: data?.name || 'Test Class',
      min_age: data?.min_age || 3,
      max_age: data?.max_age || 5,
    },
  });
}

/**
 * Create a test child helper
 */
export async function createTestChild(data?: {
  name?: string;
  age?: number;
  class_id?: number;
}) {
  let classId = data?.class_id;
  if (!classId) {
    const testClass = await createTestClass();
    classId = testClass.id;
  }

  return await prisma.child.create({
    data: {
      name: data?.name || 'Test Child',
      age: data?.age || 4,
      class_id: classId,
    },
  });
}

/**
 * Create a test category helper
 */
export async function createTestCategory(data?: {
  name?: string;
  description?: string;
}) {
  return await prisma.category.create({
    data: {
      name: data?.name || 'Test Category',
      description: data?.description || 'Test category description',
    },
  });
}

/**
 * Create a test milestone helper
 */
export async function createTestMilestone(data?: {
  name?: string;
  description?: string;
  min_age?: number;
  max_age?: number;
  category_id?: number;
}) {
  let categoryId = data?.category_id;
  if (!categoryId) {
    const testCategory = await createTestCategory();
    categoryId = testCategory.id;
  }

  return await prisma.milestone.create({
    data: {
      name: data?.name || 'Test Milestone',
      description: data?.description || 'Test milestone description',
      min_age: data?.min_age || 3,
      max_age: data?.max_age || 5,
      category_id: categoryId,
    },
  });
}

/**
 * Create a test evaluation helper
 */
export async function createTestEvaluation(data?: {
  score?: number;
  comments?: string;
  child_id?: number;
}) {
  let childId = data?.child_id;
  if (!childId) {
    const testChild = await createTestChild();
    childId = testChild.id;
  }

  return await prisma.evaluation.create({
    data: {
      score: data?.score || 85,
      comments: data?.comments || 'Test evaluation comments',
      child_id: childId,
    },
  });
}

// Counter for unique emails in tests
let emailCounter = 0;

/**
 * Create authentication token for testing
 */
export async function createAuthToken(userData?: {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}): Promise<{ token: string; user: any }> {
  const hashedPassword = await bcrypt.hash(
    userData?.password || 'password123',
    10
  );

  // Generate unique email for each call
  const email = userData?.email || `auth-${++emailCounter}@test.com`;

  const user = await createTestUser({
    first_name: userData?.first_name || 'Auth',
    last_name: userData?.last_name || 'User',
    email,
    password: hashedPassword,
  });

  const role = await prisma.role.findUnique({
    where: { id: user.role_id },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: role?.name || 'Tester',
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, user };
}

export { prisma };
