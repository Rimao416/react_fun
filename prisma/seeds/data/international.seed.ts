import { Availability, EducationLevel, ExperienceLevel, Goal, LanguageLevel, PaymentMethod, PrismaClient, ServiceType, UserRole, UserStatus } from "../../../src/generated/prisma";
import { hashPassword, logSuccess } from "../utils/helpers";

export async function seedInternationalFreelancers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const freelancersData = [
    {
      email: 'charles.ngono@gmail.com',
      firstName: 'Charles',
      lastName: 'Ngono',
      phone: '+237677123456',
      avatar: 'https://i.pravatar.cc/150?img=57',
      country: 'Cameroun',
      city: 'Douala',
      district: 'Akwa',
      bio: 'Applications mobiles performantes et intuitives.',
      fullBio: 'Développeur mobile spécialisé en Flutter. Création d\'applications iOS et Android.',
      skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development', 'UI/UX'],
      hourlyRate: 5500,
      experienceLevel: ExperienceLevel.EXPERIENCED,
      selectedSkills: ['Flutter', 'Mobile Dev', 'Firebase', 'UI/UX'],
      categories: ['Développement', 'Mobile'],
      fieldOfStudy: 'Génie logiciel',
      paymentProvider: 'MTN MoMo Cameroun',
      rating: 4.8,
      totalReviews: 29,
      completedJobs: 32,
      successRate: 96,
      responseTime: 100,
    },
    {
      email: 'yao.kouassi@gmail.com',
      firstName: 'Yao',
      lastName: 'Kouassi',
      phone: '+225070123456',
      avatar: 'https://i.pravatar.cc/150?img=62',
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      district: 'Cocody',
      bio: 'ROI garanti sur vos campagnes publicitaires. Reporting détaillé inclus.',
      fullBio: 'Expert en marketing digital et publicité Facebook. Augmentez votre ROI avec des campagnes ciblées.',
      skills: ['Facebook Ads', 'Google Ads', 'Marketing Digital', 'Analytics', 'SEO/SEM'],
      hourlyRate: 4500,
      experienceLevel: ExperienceLevel.EXPERT,
      selectedSkills: ['Facebook Ads', 'Google Ads', 'Marketing', 'Analytics'],
      categories: ['Marketing', 'Publicité'],
      fieldOfStudy: 'Marketing',
      paymentProvider: 'Orange Money CI',
      rating: 4.9,
      totalReviews: 41,
      completedJobs: 45,
      successRate: 98,
      responseTime: 70,
    },
  ];

  const freelancers = await Promise.all(
    freelancersData.map((data) =>
      prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: UserRole.FREELANCER,
          status: UserStatus.ACTIVE,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          emailVerified: true,
          phoneVerified: true,
          country: data.country,
          language: 'fr',
          avatar: data.avatar,
          profile: {
            create: {
              bio: data.fullBio,
              skills: data.skills,
              hourlyRate: data.hourlyRate,
              portfolio: {
                certifications: ['Badge Expert', 'Badge International'],
                completedCourses: 35,
                totalXP: 9500,
              },
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
          onboardingProgress: {
            create: {
              currentStep: 10,
              completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              isCompleted: true,
            },
          },
          onboardingData: {
            create: {
              serviceType: ServiceType.DIGITAL,
              country: data.country,
              city: data.city,
              district: data.district,
              canTravel: false,
              experienceLevel: data.experienceLevel,
              goal: Goal.BUILD_BUSINESS,
              selectedSkills: data.selectedSkills,
              categories: data.categories,
              educationLevel: EducationLevel.UNIVERSITY,
              fieldOfStudy: data.fieldOfStudy,
              languages: {
                french: LanguageLevel.NATIVE,
                english: LanguageLevel.FLUENT,
              },
              availability: [Availability.FLEXIBLE],
              hoursPerWeek: 40,
              phoneVerified: true,
              whatsappNumber: data.phone,
              paymentMethod: PaymentMethod.MOBILE_MONEY,
              paymentDetails: {
                provider: data.paymentProvider,
                number: data.phone,
              },
              bio: data.bio,
              profileCompleted: true,
            },
          },
        },
      })
    )
  );

  logSuccess(`${freelancers.length} freelancers internationaux créés`);
  return freelancers;
}