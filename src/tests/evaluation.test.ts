import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestEvaluation, createTestChild } from './helpers.ts';

describe('Evaluation API', () => {
  let authToken: string;
  let testChildId: number;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;

    const child = await createTestChild({ name: 'Test Child' });
    testChildId = child.id;
  });

  describe('GET /api/evaluations', () => {
    it('should get all evaluations', async () => {
      await createTestEvaluation({
        score: 85,
        comments: 'Good progress',
        child_id: testChildId
      });
      await createTestEvaluation({
        score: 90,
        comments: 'Excellent work',
        child_id: testChildId
      });

      const response = await request(app)
        .get('/api/evaluations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/evaluations');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/evaluations/:id', () => {
    it('should get evaluation by id', async () => {
      const evaluation = await createTestEvaluation({
        score: 88,
        comments: 'Great improvement',
        child_id: testChildId
      });

      const response = await request(app)
        .get(`/api/evaluations/${evaluation.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', evaluation.id);
      expect(response.body).toHaveProperty('score', 88);
      expect(response.body).toHaveProperty('comments', 'Great improvement');
      expect(response.body).toHaveProperty('child_id', testChildId);
    });

    it('should return 404 for non-existent evaluation', async () => {
      const response = await request(app)
        .get('/api/evaluations/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/evaluations', () => {
    it('should create a new evaluation', async () => {
      const response = await request(app)
        .post('/api/evaluations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          score: 92,
          comments: 'Outstanding performance',
          child_id: testChildId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('score', 92);
      expect(response.body).toHaveProperty('comments', 'Outstanding performance');
      expect(response.body).toHaveProperty('child_id', testChildId);
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/evaluations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(500);
    });

    it('should create evaluation without comments', async () => {
      const response = await request(app)
        .post('/api/evaluations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          score: 75,
          child_id: testChildId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('score', 75);
      expect(response.body).toHaveProperty('child_id', testChildId);
    });
  });

  describe('PUT /api/evaluations/:id', () => {
    it('should update evaluation', async () => {
      const evaluation = await createTestEvaluation({
        score: 70,
        comments: 'Needs improvement',
        child_id: testChildId
      });

      const response = await request(app)
        .put(`/api/evaluations/${evaluation.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          score: 85,
          comments: 'Much better!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score', 85);
      expect(response.body).toHaveProperty('comments', 'Much better!');
    });
  });

  describe('DELETE /api/evaluations/:id', () => {
    it('should delete evaluation', async () => {
      const evaluation = await createTestEvaluation({
        score: 80,
        child_id: testChildId
      });

      const response = await request(app)
        .delete(`/api/evaluations/${evaluation.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify evaluation is deleted
      const getResponse = await request(app)
        .get(`/api/evaluations/${evaluation.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
