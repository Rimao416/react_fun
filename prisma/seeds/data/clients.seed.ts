// ========================================================
// 📄 prisma/seeds/data/clients.seed.ts
// ========================================================
import { PrismaClient, UserRole, UserStatus } from '../../../src/generated/prisma';
import { hashPassword, logSuccess } from '../utils/helpers';

export async function seedClients(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const clientsData = [
    {
      email: 'mamadou.diop@gmail.com',
      firstName: 'Mamadou',
      lastName: 'Diop',
      phone: '+221775551234',
      bio: 'Chef d\'entreprise à Dakar, recherche services de qualité pour mon domicile et mes bureaux.',
      rating: 4.8,
      totalReviews: 12,
      completedJobs: 15,
      successRate: 95,
      responseTime: 120,
    },
    {
      email: 'restaurant.teranga@outlook.com',
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      phone: '+221776662345',
      bio: 'Propriétaire du Restaurant Teranga à Dakar Plateau. Recherche personnel qualifié et ponctuel.',
      rating: 4.9,
      totalReviews: 28,
      completedJobs: 35,
      successRate: 98,
      responseTime: 60,
    },
    {
      email: 'contact@afritech-solutions.sn',
      firstName: 'Abdoulaye',
      lastName: 'Sow',
      phone: '+221777773456',
      bio: 'Startup tech basée à Dakar. Besoin régulier de designers, développeurs et community managers.',
      rating: 4.7,
      totalReviews: 45,
      completedJobs: 52,
      successRate: 92,
      responseTime: 180,
    },
    {
      email: 'coordinator@ngohope.org',
      firstName: 'Marie',
      lastName: 'Dubois',
      phone: '+221778884567',
      bio: 'ONG internationale recherchant agents terrain pour collecte de données et traductions.',
      rating: 5.0,
      totalReviews: 67,
      completedJobs: 89,
      successRate: 100,
      responseTime: 45,
    },
  ];

  const clients = await Promise.all(
    clientsData.map((data) =>
      prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: UserRole.CLIENT,
          status: UserStatus.ACTIVE,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          emailVerified: true,
          phoneVerified: true,
          country: 'Senegal',
          language: 'fr',
          profile: {
            create: {
              bio: data.bio,
            },
          },
          reputation: {
            create: {
              rating: data.rating,
              totalReviews: data.totalReviews,
              completedJobs: data.completedJobs,
              successRate: data.successRate,
              responseTime: data.responseTime,
            },
          },
        },
      })
    )
  );

  logSuccess(`${clients.length} clients créés`);
  return clients;
}
