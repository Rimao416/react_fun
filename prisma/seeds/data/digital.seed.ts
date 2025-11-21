// ========================================================
import { PrismaClient, UserRole, UserStatus, ServiceType, ExperienceLevel, Goal, EducationLevel, LanguageLevel, Availability, PaymentMethod } from '../../../src/generated/prisma';
import { hashPassword, logSuccess } from '../utils/helpers';

export async function seedDigitalFreelancers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const freelancersData = [
    {
      email: 'cheikh.sy@gmail.com',
      firstName: 'Cheikh',
      lastName: 'Sy',
      phone: '+221779995555',
      avatar: 'https://i.pravatar.cc/150?img=15',
      district: 'Plateau',
      bio: 'Développeur web freelance. Livraison rapide et code de qualité.',
      fullBio: 'Développeur web passionné, formé via Siyé. Spécialisé en React et Node.js.',
      skills: ['React', 'Node.js', 'JavaScript', 'HTML/CSS', 'API REST', 'Git'],
      hourlyRate: 5000,
      experienceLevel: ExperienceLevel.EXPERIENCED,
      selectedSkills: ['Développement Web', 'React', 'Node.js', 'JavaScript', 'API'],
      categories: ['Développement', 'Web'],
      fieldOfStudy: 'Informatique',
      rating: 4.7,
      totalReviews: 34,
      completedJobs: 38,
      successRate: 94,
      responseTime: 120,
      hoursPerWeek: 30,
    },
    {
      email: 'marieme.sarr@outlook.com',
      firstName: 'Marieme',
      lastName: 'Sarr',
      phone: '+221779996666',
      avatar: 'https://i.pravatar.cc/150?img=20',
      district: 'Mermoz',
      bio: 'Portfolio disponible sur demande. Créations originales et sur-mesure.',
      fullBio: 'Designer graphique créative. Spécialisée en identité visuelle, flyers et réseaux sociaux.',
      skills: ['Photoshop', 'Illustrator', 'Canva', 'Branding', 'Social Media Design', 'Figma'],
      hourlyRate: 4000,
      experienceLevel: ExperienceLevel.EXPERT,
      selectedSkills: ['Design Graphique', 'Branding', 'Photoshop', 'Illustrator', 'Social Media'],
      categories: ['Design', 'Marketing'],
      fieldOfStudy: 'Arts graphiques',
      rating: 4.9,
      totalReviews: 67,
      completedJobs: 72,
      successRate: 98,
      responseTime: 90,
      hoursPerWeek: 35,
    },
    {
      email: 'ousmane.mbaye@yahoo.com',
      firstName: 'Ousmane',
      lastName: 'Mbaye',
      phone: '+221779997777',
      avatar: 'https://i.pravatar.cc/150?img=51',
      district: 'Sacre Coeur',
      bio: 'Livraison rapide et contenu de qualité garanti. Références disponibles.',
      fullBio: 'Rédacteur et traducteur trilingue (Français, Anglais, Wolof). Spécialisé en articles de blog.',
      skills: ['Rédaction Web', 'Traduction FR-EN', 'SEO', 'Articles Blog', 'Contenu Social Media'],
      hourlyRate: 3500,
      experienceLevel: ExperienceLevel.EXPERIENCED,
      selectedSkills: ['Rédaction', 'Traduction', 'SEO', 'Correction'],
      categories: ['Rédaction', 'Traduction'],
      fieldOfStudy: 'Lettres modernes',
      rating: 4.8,
      totalReviews: 56,
      completedJobs: 63,
      successRate: 96,
      responseTime: 60,
      hoursPerWeek: 20,
    },
    {
      email: 'khady.gueye@gmail.com',
      firstName: 'Khady',
      lastName: 'Gueye',
      phone: '+221779998888',
      avatar: 'https://i.pravatar.cc/150?img=44',
      district: 'Yoff',
      bio: 'Boostez votre présence en ligne ! Gestion complète de vos réseaux sociaux.',
      fullBio: 'Community Manager dynamique et créative. Gestion complète des réseaux sociaux.',
      skills: ['Community Management', 'Facebook Ads', 'Instagram', 'TikTok', 'Stratégie Social Media', 'Canva'],
      hourlyRate: 3000,
      experienceLevel: ExperienceLevel.EXPERIENCED,
      selectedSkills: ['Community Management', 'Social Media', 'Content Creation', 'Facebook Ads'],
      categories: ['Marketing', 'Social Media'],
      fieldOfStudy: 'Communication',
      rating: 4.9,
      totalReviews: 43,
      completedJobs: 48,
      successRate: 97,
      responseTime: 75,
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
                completedCourses: 30,
                totalXP: 8000,
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
              country: 'Senegal',
              city: 'Dakar',
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
                wolof: LanguageLevel.NATIVE,
              },
              availability: [Availability.FLEXIBLE],
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

  logSuccess(`${freelancers.length} freelancers services digitaux créés`);
  return freelancers;
}
