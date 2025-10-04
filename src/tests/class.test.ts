import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestClass } from './helpers.ts';

describe('Class API', () => {
  let authToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;
  });

  describe('GET /api/classes', () => {
    it('should get all classes', async () => {
      await createTestClass({ name: 'Toddlers', min_age: 2, max_age: 3 });
      await createTestClass({ name: 'Preschool', min_age: 3, max_age: 5 });

      const response = await request(app)
        .get('/api/classes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/classes');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/classes/:id', () => {
    it('should get class by id', async () => {
      const classEntity = await createTestClass({
        name: 'Kindergarten',
        min_age: 5,
        max_age: 6,
      });

      const response = await request(app)
        .get(`/api/classes/${classEntity.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', classEntity.id);
      expect(response.body).toHaveProperty('name', 'Kindergarten');
      expect(response.body).toHaveProperty('min_age', 5);
      expect(response.body).toHaveProperty('max_age', 6);
    });

    it('should return 404 for non-existent class', async () => {
      const response = await request(app)
        .get('/api/classes/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/classes', () => {
    it('should create a new class', async () => {
      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Elementary',
          min_age: 6,
          max_age: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Elementary');
      expect(response.body).toHaveProperty('min_age', 6);
      expect(response.body).toHaveProperty('max_age', 10);
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Incomplete Class',
          // Missing min_age and max_age
        });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/classes/:id', () => {
    it('should update class name', async () => {
      const classEntity = await createTestClass({
        name: 'Original Class',
        min_age: 3,
        max_age: 5,
      });

      const response = await request(app)
        .put(`/api/classes/${classEntity.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Class',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Class');
    });

    it('should update age range', async () => {
      const classEntity = await createTestClass({
        name: 'Age Range Class',
        min_age: 3,
        max_age: 5,
      });

      const response = await request(app)
        .put(`/api/classes/${classEntity.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          min_age: 4,
          max_age: 6,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('min_age', 4);
      expect(response.body).toHaveProperty('max_age', 6);
    });
  });

  describe('DELETE /api/classes/:id', () => {
    it('should delete class', async () => {
      const classEntity = await createTestClass({
        name: 'To Be Deleted',
      });

      const response = await request(app)
        .delete(`/api/classes/${classEntity.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify class is deleted
      const getResponse = await request(app)
        .get(`/api/classes/${classEntity.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
