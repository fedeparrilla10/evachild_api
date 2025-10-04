import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { cleanDatabase, createAuthToken, createTestRole } from './helpers.ts';

describe('Role API', () => {
  let authToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    const { token } = await createAuthToken();
    authToken = token;
  });

  describe('GET /api/roles', () => {
    it('should get all roles', async () => {
      await createTestRole('Admin');
      await createTestRole('Teacher');

      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/roles');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should get role by id', async () => {
      const role = await createTestRole('Principal');

      const response = await request(app)
        .get(`/api/roles/${role.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', role.id);
      expect(response.body).toHaveProperty('name', 'Principal');
    });

    it('should return 404 for non-existent role', async () => {
      const response = await request(app)
        .get('/api/roles/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/roles', () => {
    it('should create a new role', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Parent',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Parent');
    });

    it('should fail with duplicate role name', async () => {
      await createTestRole('Duplicate');

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Duplicate',
        });

      expect(response.status).toBe(500);
    });

    it('should fail without name', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/roles/:id', () => {
    it('should update role name', async () => {
      const role = await createTestRole('Original Role');

      const response = await request(app)
        .put(`/api/roles/${role.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Role',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Role');
    });

    it('should fail with duplicate name', async () => {
      await createTestRole('Existing Role');
      const roleToUpdate = await createTestRole('Role To Update');

      const response = await request(app)
        .put(`/api/roles/${roleToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Existing Role',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('should delete role', async () => {
      const role = await createTestRole('To Be Deleted');

      const response = await request(app)
        .delete(`/api/roles/${role.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify role is deleted
      const getResponse = await request(app)
        .get(`/api/roles/${role.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
