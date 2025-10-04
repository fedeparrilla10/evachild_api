import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestMilestone, createTestCategory } from './helpers.ts';

describe('Milestone API', () => {
  let authToken: string;
  let testCategoryId: number;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;

    const category = await createTestCategory({ name: 'Test Category' });
    testCategoryId = category.id;
  });

  describe('GET /api/milestones', () => {
    it('should get all milestones', async () => {
      await createTestMilestone({
        name: 'Can walk independently',
        category_id: testCategoryId
      });
      await createTestMilestone({
        name: 'Can speak 10 words',
        category_id: testCategoryId
      });

      const response = await request(app)
        .get('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/milestones');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/milestones/:id', () => {
    it('should get milestone by id', async () => {
      const milestone = await createTestMilestone({
        name: 'Can climb stairs',
        description: 'Child can climb stairs without assistance',
        min_age: 24,
        max_age: 36,
        category_id: testCategoryId
      });

      const response = await request(app)
        .get(`/api/milestones/${milestone.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', milestone.id);
      expect(response.body).toHaveProperty('name', 'Can climb stairs');
      expect(response.body).toHaveProperty('min_age', 24);
      expect(response.body).toHaveProperty('max_age', 36);
    });

    it('should return 404 for non-existent milestone', async () => {
      const response = await request(app)
        .get('/api/milestones/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/milestones', () => {
    it('should create a new milestone', async () => {
      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Can count to 10',
          description: 'Child can count from 1 to 10',
          min_age: 36,
          max_age: 48,
          category_id: testCategoryId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Can count to 10');
      expect(response.body).toHaveProperty('min_age', 36);
      expect(response.body).toHaveProperty('max_age', 48);
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/milestones/:id', () => {
    it('should update milestone', async () => {
      const milestone = await createTestMilestone({
        name: 'Original milestone',
        category_id: testCategoryId
      });

      const response = await request(app)
        .put(`/api/milestones/${milestone.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated milestone',
          description: 'Updated description',
          min_age: 30,
          max_age: 40
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated milestone');
      expect(response.body).toHaveProperty('description', 'Updated description');
      expect(response.body).toHaveProperty('min_age', 30);
      expect(response.body).toHaveProperty('max_age', 40);
    });
  });

  describe('DELETE /api/milestones/:id', () => {
    it('should delete milestone', async () => {
      const milestone = await createTestMilestone({
        name: 'To Be Deleted',
        category_id: testCategoryId
      });

      const response = await request(app)
        .delete(`/api/milestones/${milestone.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify milestone is deleted
      const getResponse = await request(app)
        .get(`/api/milestones/${milestone.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
