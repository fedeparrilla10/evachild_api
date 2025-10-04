import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import {
  cleanDatabase,
  createAuthToken,
  createTestChild,
  createTestClass,
} from './helpers.ts';

describe('Child API', () => {
  let authToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;
  });

  describe('GET /api/children', () => {
    it('should get all children', async () => {
      await createTestChild();
      await createTestChild({ name: 'Child 2', age: 5 });

      const response = await request(app)
        .get('/api/children')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/children');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/children/:id', () => {
    it('should get child by id', async () => {
      const child = await createTestChild({
        name: 'Little Bobby',
        age: 4,
      });

      const response = await request(app)
        .get(`/api/children/${child.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', child.id);
      expect(response.body).toHaveProperty('name', 'Little Bobby');
      expect(response.body).toHaveProperty('age', 4);
    });

    it('should return 404 for non-existent child', async () => {
      const response = await request(app)
        .get('/api/children/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/children', () => {
    it('should create a new child', async () => {
      const testClass = await createTestClass();

      const response = await request(app)
        .post('/api/children')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Child',
          age: 3,
          class_id: testClass.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Child');
      expect(response.body).toHaveProperty('age', 3);
      expect(response.body).toHaveProperty('class_id', testClass.id);
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/children')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Incomplete Child',
          // Missing age and class_id
        });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/children/:id', () => {
    it('should update child', async () => {
      const child = await createTestChild({
        name: 'Original Name',
        age: 3,
      });

      const response = await request(app)
        .put(`/api/children/${child.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          age: 4,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('age', 4);
    });

    it('should update child class', async () => {
      const child = await createTestChild();
      const newClass = await createTestClass({ name: 'Advanced Class' });

      const response = await request(app)
        .put(`/api/children/${child.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          class_id: newClass.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('class_id', newClass.id);
    });
  });

  describe('DELETE /api/children/:id', () => {
    it('should delete child', async () => {
      const child = await createTestChild({
        name: 'To Be Deleted',
      });

      const response = await request(app)
        .delete(`/api/children/${child.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify child is deleted
      const getResponse = await request(app)
        .get(`/api/children/${child.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
