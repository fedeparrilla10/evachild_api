import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestUser } from './helpers.ts';
import bcrypt from 'bcrypt';

describe('User API', () => {
  let authToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await createTestUser({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        password: hashedPassword,
      });

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', 'john@test.com');
      expect(response.body).toHaveProperty('first_name', 'John');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@test.com',
          password: 'password123',
          role_id: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', 'jane@test.com');
      expect(response.body).toHaveProperty('first_name', 'Jane');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail with duplicate email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await createTestUser({
        first_name: 'Existing',
        last_name: 'User',
        email: 'existing@test.com',
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'existing@test.com',
          password: 'password123',
          role_id: 1,
        });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await createTestUser({
        first_name: 'Original',
        last_name: 'Name',
        email: 'original@test.com',
        password: hashedPassword,
      });

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first_name: 'Updated',
          last_name: 'Name',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('first_name', 'Updated');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await createTestUser({
        first_name: 'ToDelete',
        last_name: 'User',
        email: 'delete@test.com',
        password: hashedPassword,
      });

      const response = await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify user is deleted
      const getResponse = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
