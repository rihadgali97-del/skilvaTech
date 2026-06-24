import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';
import { createTestUser, createTestRole } from '../helpers/fixtures.js';

// ─── DEFENSIVE ACCESS TOKEN EXTRACTOR ────────────────────────────────────────
// Prevents downstream "Cannot read properties of undefined" failures by securely
// digging into any standard API envelope layout.
const extractAccessToken = (res) => {
  if (!res || !res.body) return undefined;
  const data = res.body.data || res.body;
  return data.token || data.accessToken || data.tokens?.accessToken || data.tokens?.token;
};

let token;

describe('Clients CRUD (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();

    const role = await createTestRole({
      name: 'crm_admin',
      permissionNames: ['clients:read', 'clients:create', 'clients:update', 'clients:delete'],
    });

    const user = await createTestUser({
      email: 'crm@example.com',
      password: 'TestPassword123!',
      firstName: 'CRM',
      lastName: 'Admin',
      roleId: role.id,
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: 'TestPassword123!',
      });

    token = extractAccessToken(loginRes);
  });

  describe('POST /api/v1/clients', () => {
    it('creates a client with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name:    'Acme Corp',
          email:   'acme@example.com',
          company: 'Acme Corporation',
          phone:   '+1 555 000 0001',
        });

      expect(res.status).toBe(201);
      
      const client = res.body.data?.client || res.body.data;
      expect(client.name).toBe('Acme Corp');
      expect(client.email).toBe('acme@example.com');
      expect(client.password).toBeUndefined();
    });

    it('rejects a duplicate email', async () => {
      await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'First', email: 'same@example.com' });

      const res = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Second', email: 'same@example.com' });

      // FIXED: Database level unique constraint violations return a 409 Conflict
      expect(res.status).toBe(409); 
      expect(res.body.success).toBe(false);
    });

    it('rejects missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ company: 'No name or email' });

      expect(res.status).toBe(422); // Handled by Zod schema object parsing
    });

    it('rejects invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test', email: 'not-an-email' });

      expect(res.status).toBe(422); // Handled by Zod email parser validation
    });

    it('returns 401 without a token', async () => {
      const res = await request(app)
        .post('/api/v1/clients')
        .send({ name: 'Test', email: 'test@example.com' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/clients', () => {
    it('returns a paginated list of clients', async () => {
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post('/api/v1/clients')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: `Client ${i}`, email: `client${i}@example.com` });
      }

      const res = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      // Defensively maps both a raw data array or a resource-nested collection data layout
      const records = res.body.data?.clients || res.body.data;
      expect(records).toHaveLength(3);
      expect(res.body.pagination.total).toBe(3);
    });

    it('filters by search query', async () => {
      await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Alpha Corp', email: 'alpha@example.com' });
      await request(app).post('/api/v1/clients').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Beta Inc', email: 'beta@example.com' });

      const res = await request(app)
        .get('/api/v1/clients?search=alpha')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      
      const records = res.body.data?.clients || res.body.data;
      expect(records).toHaveLength(1);
      expect(records[0].name).toBe('Alpha Corp');
    });

    it('returns 401 without a token', async () => {
      const res = await request(app).get('/api/v1/clients');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/clients/:id', () => {
    it('updates an existing client', async () => {
      const createRes = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Before', email: 'before@example.com' });

      const createdData = createRes.body.data?.client || createRes.body.data;
      const clientId = createdData.id;

      const res = await request(app)
        .patch(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'After Update', phone: '+1 999 000 0000' });

      expect(res.status).toBe(200);
      
      const updatedClient = res.body.data?.client || res.body.data;
      expect(updatedClient.name).toBe('After Update');
      expect(updatedClient.phone).toBe('+1 999 000 0000');
    });

    it('returns 404 for a non-existent client', async () => {
      const res = await request(app)
        .patch('/api/v1/clients/nonexistent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/clients/:id', () => {
    it('deletes an existing client', async () => {
      const createRes = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'To Delete', email: 'delete@example.com' });

      const createdData = createRes.body.data?.client || createRes.body.data;
      const clientId = createdData.id;

      const deleteRes = await request(app)
        .delete(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });

    it('returns 404 when deleting a non-existent client', async () => {
      const res = await request(app)
        .delete('/api/v1/clients/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('returns 403 when a user lacks delete permission', async () => {
      const readRole = await createTestRole({
        name: 'read_only',
        permissionNames: ['clients:read'],
      });
      const readUser = await createTestUser({
        email: 'readonly@example.com',
        password: 'TestPassword123!',
        firstName: 'Read',
        lastName: 'Only',
        roleId: readRole.id,
      });
      
      const readLoginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: readUser.email,
          password: 'TestPassword123!',
        });
        
      const readToken = extractAccessToken(readLoginRes);

      const createRes = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Protected', email: 'protected@example.com' });

      const createdData = createRes.body.data?.client || createRes.body.data;

      const res = await request(app)
        .delete(`/api/v1/clients/${createdData.id}`)
        .set('Authorization', `Bearer ${readToken}`);

      expect(res.status).toBe(403);
    });
  });
});