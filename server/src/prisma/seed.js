import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ROLES } from '../shared/constants/roles.js';
import { PERMISSION_LIST } from '../shared/constants/permissions.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  console.log('  Creating permissions...');
  const permissions = await Promise.all(
    PERMISSION_LIST.map((name) => {
      const [resource, action] = name.split(':');
      return prisma.permission.upsert({
        where: { name },
        create: { name, resource, action },
        update: {},
      });
    })
  );
  console.log(`  ✅ ${permissions.length} permissions`);

  console.log('  Creating roles...');

  const superAdminRole = await prisma.role.upsert({
    where: { name: ROLES.SUPER_ADMIN },
    create: { name: ROLES.SUPER_ADMIN, description: 'Full system access', isSystem: true },
    update: {},
  });

  const adminRole = await prisma.role.upsert({
    where: { name: ROLES.ADMIN },
    create: { name: ROLES.ADMIN, description: 'Platform administrator', isSystem: true },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: ROLES.STUDENT },
    create: {
      name: ROLES.STUDENT,
      description: 'Default student role',
      isSystem: true,
      isDefault: true,
    },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: ROLES.INSTRUCTOR },
    create: { name: ROLES.INSTRUCTOR, description: 'Course instructor', isSystem: true },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: ROLES.CLIENT },
    create: { name: ROLES.CLIENT, description: 'Business client', isSystem: true },
    update: {},
  });

  console.log('  ✅ Roles created');

  console.log('  Assigning permissions to super_admin...');
  await Promise.all(
    permissions.map((p) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
        create: { roleId: superAdminRole.id, permissionId: p.id },
        update: {},
      })
    )
  );

  const adminPermissionNames = PERMISSION_LIST.filter(
    (p) => !p.startsWith('settings:') && !p.startsWith('audit:')
  );
  const adminPerms = permissions.filter((p) => adminPermissionNames.includes(p.name));
  await Promise.all(
    adminPerms.map((p) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
        create: { roleId: adminRole.id, permissionId: p.id },
        update: {},
      })
    )
  );
  console.log('  ✅ Permissions assigned');

  console.log('  Creating super admin user...');
  const hashedPassword = await bcrypt.hash('SuperAdmin123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@skilvatech.com' },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@skilvatech.com',
      password: hashedPassword,
      isEmailVerified: true,
      roleId: superAdminRole.id,
    },
    update: {},
  });

  console.log(`  ✅ Super admin: ${superAdmin.email}`);
  console.log('');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('  Super Admin credentials:');
  console.log('  Email:    admin@skilvatech.com');
  console.log('  Password: SuperAdmin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
