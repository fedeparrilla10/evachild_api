import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../server.ts";
import { cleanDatabase, createTestUser } from "./helpers.ts";
import bcrypt from "bcrypt";

describe("Auth API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      // Arrange: Create a test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      await createTestUser({
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: hashedPassword,
      });

      // Act: Login
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBeTruthy();
    });

    it("should fail with invalid email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should fail with invalid password", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      await createTestUser({
        first_name: "Test User",
        last_name: "User",
        email: "test@example.com",
        password: hashedPassword,
      });

      // Act
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should fail with missing credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
    });
  });
});
