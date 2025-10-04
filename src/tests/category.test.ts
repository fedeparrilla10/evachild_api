import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestCategory } from './helpers.ts';

describe('Category API', () => {
  let authToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      await createTestCategory({ name: 'Motor Skills' });
      await createTestCategory({ name: 'Social Development' });

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get category by id', async () => {
      const category = await createTestCategory({
        name: 'Cognitive Skills',
        description: 'Cognitive development milestones'
      });

      const response = await request(app)
        .get(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', category.id);
      expect(response.body).toHaveProperty('name', 'Cognitive Skills');
      expect(response.body).toHaveProperty('description', 'Cognitive development milestones');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Language Development',
          description: 'Language and communication skills'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Language Development');
      expect(response.body).toHaveProperty('description', 'Language and communication skills');
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      const category = await createTestCategory({
        name: 'Original Name',
        description: 'Original description'
      });

      const response = await request(app)
        .put(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('description', 'Updated description');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      const category = await createTestCategory({ name: 'To Be Deleted' });

      const response = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify category is deleted
      const getResponse = await request(app)
        .get(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
