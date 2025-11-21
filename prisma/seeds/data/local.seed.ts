import { PrismaClient, UserRole, UserStatus, ServiceType, ExperienceLevel, Goal, EducationLevel, LanguageLevel, Availability, PaymentMethod } from '../../../src/generated/prisma';
import { hashPassword, logSuccess } from '../utils/helpers';

export async function seedLocalFreelancers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const freelancersData = [
    {
      email: 'aminata.ba@gmail.com',
      firstName: 'Aminata',
      lastName: 'Ba',
      phone: '+221779991111',
      avatar: 'https://i.pravatar.cc/150?img=5',
      district: 'Medina',
      bio: 'Passionnée de cuisine traditionnelle sénégalaise. Disponible pour événements et service régulier.',
      skills: ['Cuisine Sénégalaise', 'Traiteur Événements', 'Hygiène Alimentaire', 'Gestion Équipe', 'Service Client'],
      hourlyRate: 3500,
      experienceLevel: ExperienceLevel.EXPERT,
      selectedSkills: ['Cuisine Sénégalaise', 'Traiteur', 'Pâtisserie', 'Hygiène'],
      categories: ['Cuisine', 'Événementiel'],
      maxDistance: 15,
      hoursPerWeek: 40,
    },
    {
      email: 'ibrahima.fall@yahoo.fr',
      firstName: 'Ibrahima',
      lastName: 'Fall',
      phone: '+221779992222',
      avatar: 'https://i.pravatar.cc/150?img=12',
      district: 'Parcelles Assainies',
      bio: 'Sérieux et motivé. Disponible rapidement pour tout type de nettoyage.',
      skills: ['Nettoyage Bureaux', 'Nettoyage Domicile', 'Hygiène', 'Ponctualité', 'Service Client'],
      hourlyRate: 1500,
      experienceLevel: ExperienceLevel.BEGINNER,
      selectedSkills: ['Nettoyage', 'Entretien', 'Hygiène'],
      categories: ['Nettoyage', 'Entretien'],
      maxDistance: 20,
      hoursPerWeek: 45,
    },
    // Ajoute les autres freelancers locaux ici...
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
              bio: data.bio,
              skills: data.skills,
              hourlyRate: data.hourlyRate,
            },
          },
          reputation: {
            create: {
              rating: 4.8,
              totalReviews: 50,
              completedJobs: 55,
              successRate: 96,
              responseTime: 45,
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
              serviceType: ServiceType.LOCAL,
              country: 'Senegal',
              city: 'Dakar',
              district: data.district,
              canTravel: true,
              maxDistance: data.maxDistance,
              experienceLevel: data.experienceLevel,
              goal: Goal.BUILD_BUSINESS,
              selectedSkills: data.selectedSkills,
              categories: data.categories,
              educationLevel: EducationLevel.SECONDARY,
              languages: {
                wolof: LanguageLevel.NATIVE,
                french: LanguageLevel.FLUENT,
              },
              availability: [Availability.MORNING, Availability.AFTERNOON, Availability.FLEXIBLE],
              hoursPerWeek: data.hoursPerWeek,
              phoneVerified: true,
              whatsappNumber: data.phone,
              paymentMethod: PaymentMethod.MOBILE_MONEY,
              paymentDetails: {
                provider: 'Orange Money',
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

  logSuccess(`${freelancers.length} freelancers services locaux créés`);
  return freelancers;
}
