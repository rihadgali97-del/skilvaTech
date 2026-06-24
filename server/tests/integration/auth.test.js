import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';
import { createTestUser, createTestRole } from '../helpers/fixtures.js';
import prisma from '../../src/config/db.js';

// ─── DEFENSIVE EXTRACTION HELPERS ──────────────────────────────────────────
// Ensures tests don't break regardless of token object nesting layout or cookies
const extractAccessToken = (res) => {
  if (!res || !res.body) return undefined;
  const data = res.body.data || res.body;
  return data.token || data.accessToken || data.tokens?.accessToken || data.tokens?.token;
};

const extractRefreshToken = (res) => {
  if (!res) return undefined;
  // 1. Try body parsing layouts
  const data = res.body?.data || res.body;
  if (data?.refreshToken) return data.refreshToken;
  if (data?.tokens?.refreshToken) return data.tokens?.refreshToken;

  // 2. Fallback to parsing secure HTTP-Only cookies if applicable
  const cookies = res.headers['set-cookie'] || [];
  for (const cookie of cookies) {
    if (cookie.includes('refreshToken=')) {
      return cookie.split('refreshToken=')[1].split(';')[0];
    }
  }
  return undefined;
};
// ─────────────────────────────────────────────────────────────────────────────

describe('Auth flow (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
    
    // Seed the default system role required by registration logic
    await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: { name: 'USER', description: 'Default User', isDefault: true, isSystem: false }
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('registers a new user and returns tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'StrongPassword123!',
          confirmPassword: 'StrongPassword123!',
          firstName: 'New',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      
      const data = res.body.data;
      const user = data?.user || data;
      const token = extractAccessToken(res);

      expect(user.email).toBe('newuser@example.com');
      expect(token).toBeDefined();
      expect(user.password).toBeUndefined();
    });

    it('rejects duplicate email registration', async () => {
      await createTestUser({ 
        email: 'duplicate@example.com',
        password: 'StrongPassword123!',
        firstName: 'Dup',
        lastName: 'User'
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'StrongPassword123!',
          confirmPassword: 'StrongPassword123!',
          firstName: 'Dup',
          lastName: 'User',
        });

      // FIXED: Database conflicts natively return 409 Conflict
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects weak passwords', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'weak@example.com',
          password: '123',
          confirmPassword: '123',
          firstName: 'Weak',
          lastName: 'Pass',
        });

      expect(res.status).toBe(422);
    });

    it('rejects invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'StrongPassword123!',
          confirmPassword: 'StrongPassword123!',
          firstName: 'Bad',
          lastName: 'Email',
        });

      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('logs in with correct credentials', async () => {
      const user = await createTestUser({
        email: 'logintest@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Login',
        lastName: 'Test'
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      expect(res.status).toBe(200);
      
      const data = res.body.data;
      const token = extractAccessToken(res);
      const userResponse = data?.user || data;

      expect(token).toBeDefined();
      expect(userResponse.email).toBe(user.email);
    });

    it('rejects incorrect password', async () => {
      const user = await createTestUser({
        email: 'wrongpass@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Wrong',
        lastName: 'Pass'
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'WrongPassword!' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects login for non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'ghost@example.com', password: 'Whatever123!' });

      expect(res.status).toBe(401);
    });

    it('rejects login for deactivated user', async () => {
      const user = await createTestUser({
        email: 'deactivated@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Deactivated',
        lastName: 'User',
        isActive: false,
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      expect(res.status).toBe(401);
    });
  });

  describe('Protected routes', () => {
    it('rejects requests with no token', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.status).toBe(401);
    });

    it('rejects requests with an invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer not-a-real-token');

      expect(res.status).toBe(401);
    });

    it('allows access with a valid token and sufficient permissions', async () => {
      const role = await createTestRole({
        name: 'admin_test',
        permissionNames: ['users:read'],
      });
      const user = await createTestUser({
        email: 'authorized@example.com',
        password: 'CorrectPassword123!',
        roleId: role.id,
        firstName: 'Auth',
        lastName: 'User'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      const token = extractAccessToken(loginRes);

      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('rejects access when the user lacks the required permission', async () => {
      const role = await createTestRole({ name: 'no_perms_test' });
      const user = await createTestUser({
        email: 'noperms@example.com',
        password: 'CorrectPassword123!',
        roleId: role.id,
        firstName: 'No',
        lastName: 'Perms'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      const token = extractAccessToken(loginRes);

      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('issues a new access token from a valid refresh token', async () => {
      const user = await createTestUser({
        email: 'refresh@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Refresh',
        lastName: 'User'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      const loginToken = extractAccessToken(loginRes);
      const extractedRefreshToken = extractRefreshToken(loginRes);

      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: extractedRefreshToken });

      expect(refreshRes.status).toBe(200);
      
      const newAccessToken = extractAccessToken(refreshRes);
      expect(newAccessToken).toBeDefined();
      expect(newAccessToken).not.toBe(loginToken);
    });

    it('invalidates the old refresh token after rotation (reuse is rejected)', async () => {
      const user = await createTestUser({
        email: 'rotation@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Rot',
        lastName: 'User'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      const extractedRefreshToken = extractRefreshToken(loginRes);

      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: extractedRefreshToken });

      const reuseRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: extractedRefreshToken });

      expect(reuseRes.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('invalidates the refresh token on logout', async () => {
      const user = await createTestUser({
        email: 'logout@example.com',
        password: 'CorrectPassword123!',
        firstName: 'Log',
        lastName: 'Out'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'CorrectPassword123!' });

      const token = extractAccessToken(loginRes);
      const extractedRefreshToken = extractRefreshToken(loginRes);

      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);

      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: extractedRefreshToken });

      expect(refreshRes.status).toBe(401);
    });
  });
});