import { Availability, EducationLevel, ExperienceLevel, Goal, LanguageLevel, PaymentMethod, PrismaClient, ServiceType, UserRole, UserStatus } from "../../../src/generated/prisma";
import { hashPassword, logSuccess } from "../utils/helpers";

export async function seedMixedFreelancers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const freelancersData = [
    {
      email: 'bintou.toure@gmail.com',
      firstName: 'Bintou',
      lastName: 'Touré',
      phone: '+221779999999',
      avatar: 'https://i.pravatar.cc/150?img=26',
      district: 'Ngor',
      bio: 'Capturez vos moments précieux avec professionnalisme. Portfolio sur demande.',
      fullBio: 'Photographe et vidéaste professionnelle. Mariages, événements corporate, portraits.',
      skills: ['Photographie', 'Vidéographie', 'Montage Vidéo', 'Adobe Premiere', 'Lightroom', 'Drone'],
      hourlyRate: 6000,
      experienceLevel: ExperienceLevel.EXPERT,
      selectedSkills: ['Photographie', 'Vidéographie', 'Montage', 'Retouche Photo', 'Drone'],
      categories: ['Photographie', 'Vidéo', 'Événementiel'],
      fieldOfStudy: 'Audiovisuel',
      maxDistance: 30,
      rating: 5.0,
      totalReviews: 78,
      completedJobs: 82,
      successRate: 100,
      responseTime: 30,
      hoursPerWeek: 30,
    },
    {
      email: 'lamine.ndao@outlook.com',
      firstName: 'Lamine',
      lastName: 'Ndao',
      phone: '+221770001111',
      avatar: 'https://i.pravatar.cc/150?img=68',
      district: 'Liberté',
      bio: 'Disponible pour missions digitales et terrain. Rapports détaillés garantis.',
      fullBio: 'Assistant virtuel polyvalent et agent terrain. Saisie de données, enquêtes, collecte terrain.',
      skills: ['Saisie Données', 'Excel', 'Enquêtes Terrain', 'Gestion Administrative', 'Organisation'],
      hourlyRate: 2500,
      experienceLevel: ExperienceLevel.EXPERIENCED,
      selectedSkills: ['Saisie Données', 'Excel', 'Enquêtes', 'Administration'],
      categories: ['Administration', 'Données', 'Terrain'],
      fieldOfStudy: 'Gestion',
      maxDistance: 25,
      rating: 4.7,
      totalReviews: 52,
      completedJobs: 58,
      successRate: 95,
      responseTime: 90,
      hoursPerWeek: 40,
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
          country: 'Senegal',
          language: 'fr',
          avatar: data.avatar,
          profile: {
            create: {
              bio: data.fullBio,
              skills: data.skills,
              hourlyRate: data.hourlyRate,
              portfolio: {
                certifications: ['Badge Expert', 'Badge Professionnel'],
                completedCourses: 28,
                totalXP: 7500,
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
              serviceType: ServiceType.BOTH,
              country: 'Senegal',
              city: 'Dakar',
              district: data.district,
              canTravel: true,
              maxDistance: data.maxDistance,
              experienceLevel: data.experienceLevel,
              goal: Goal.BUILD_BUSINESS,
              selectedSkills: data.selectedSkills,
              categories: data.categories,
              educationLevel: EducationLevel.VOCATIONAL,
              fieldOfStudy: data.fieldOfStudy,
              languages: {
                french: LanguageLevel.NATIVE,
                english: LanguageLevel.INTERMEDIATE,
                wolof: LanguageLevel.NATIVE,
              },
              availability: [Availability.WEEKEND, Availability.FLEXIBLE],
              hoursPerWeek: data.hoursPerWeek,
              phoneVerified: true,
              whatsappNumber: data.phone,
              paymentMethod: PaymentMethod.MOBILE_MONEY,
              paymentDetails: {
                provider: 'Wave',
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

  logSuccess(`${freelancers.length} freelancers parcours mixte créés`);
  return freelancers;
}
