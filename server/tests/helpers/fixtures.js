import bcrypt from 'bcryptjs';
import prisma from '../../src/config/db.js';

// ─── Create a role with given permissions ──────────────────────────────────────
export const createTestRole = async ({ name = 'test_role', permissionNames = [] } = {}) => {
  // Use upsert to handle cross-test naming collisions smoothly
  const role = await prisma.role.upsert({
    where: { name },
    update: {},
    create: { name, description: 'Test role', isDefault: false, isSystem: false },
  });

  if (permissionNames.length > 0) {
    const permissions = await Promise.all(
      permissionNames.map((permName) => {
        const [resource, action] = permName.split(':');
        return prisma.permission.upsert({
          where: { name: permName },
          update: {},
          create: { name: permName, resource, action },
        });
      })
    );

    // Clean up old relations for this role to avoid duplicate index issues
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    });

    await prisma.rolePermission.createMany({
      data: permissions.map((p) => ({ roleId: role.id, permissionId: p.id })),
      skipDuplicates: true,
    });
  }

  return role;
};

// ─── Create a test user with a hashed password ─────────────────────────────────
export const createTestUser = async ({
  email,
  password = 'TestPassword123!',
  firstName = 'Test',
  lastName = 'User',
  roleId,
  isActive = true,
} = {}) => {
  // Generate a strictly unique email if none is passed to avoid target collisions
  const finalEmail = email || `test-${Math.random().toString(36).substring(7)}@example.com`;
  let finalRoleId = roleId;

  if (!finalRoleId) {
    const defaultRole = await createTestRole({ name: `role_${Math.random().toString(36).substring(7)}` });
    finalRoleId = defaultRole.id;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Pre-emptively clear any blocking identical emails
  await prisma.user.deleteMany({ where: { email: finalEmail } });

  const user = await prisma.user.create({
    data: {
      email: finalEmail,
      password: hashedPassword,
      firstName,
      lastName,
      roleId: finalRoleId,
      isActive,
      isEmailVerified: true,
    },
  });

  return { ...user, plainPassword: password };
};

// ─── Build Authorization header after a real login ─────────────────────────────
export const loginAndGetToken = async (request, app, { email, password }) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });

  return res.body?.data?.accessToken || null;
};