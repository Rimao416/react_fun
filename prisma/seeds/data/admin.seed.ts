import { PrismaClient, UserRole, UserStatus } from '../../../src/generated/prisma';
import { hashPassword, logSuccess } from '../utils/helpers';

export async function seedAdmin(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@siye.africa',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Admin',
      lastName: 'Siyé',
      emailVerified: true,
      phoneVerified: true,
      phone: '+221771234567',
      country: 'Senegal',
      language: 'fr',
    },
  });

  logSuccess(`Admin créé: ${admin.email}`);
  return admin;
}