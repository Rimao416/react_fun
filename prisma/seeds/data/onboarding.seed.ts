import { PrismaClient, UserRole, UserStatus } from "../../../src/generated/prisma";
import { hashPassword, logSuccess } from "../utils/helpers";

export async function seedOnboardingFreelancers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('Password123!');

  const onboardingData = [
    {
      email: 'souleymane.diagne@gmail.com',
      firstName: 'Souleymane',
      lastName: 'Diagne',
      phone: '+221770002222',
      currentStep: 3,
      completedSteps: [1, 2],
      formData: {
        step1: { serviceType: 'LOCAL' },
        step2: { country: 'Senegal', city: 'Dakar', district: 'Guediawaye' },
      },
    },
    {
      email: 'aissatou.wade@yahoo.fr',
      firstName: 'Aissatou',
      lastName: 'Wade',
      phone: '+221770003333',
      currentStep: 6,
      completedSteps: [1, 2, 3, 4, 5],
      formData: {
        step1: { serviceType: 'DIGITAL' },
        step2: { country: 'Senegal', city: 'Dakar', district: 'Ouakam' },
        step3: { experienceLevel: 'BEGINNER' },
        step4: { goal: 'SIDE_INCOME' },
        step5: {
          selectedSkills: ['Design', 'Canva', 'Social Media'],
          categories: ['Design', 'Marketing'],
        },
      },
    },
  ];

  const freelancers = await Promise.all(
    onboardingData.map((data) =>
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
          phoneVerified: data.currentStep > 3,
          country: 'Senegal',
          language: 'fr',
          onboardingProgress: {
            create: {
              currentStep: data.currentStep,
              completedSteps: data.completedSteps,
              isCompleted: false,
              formData: data.formData,
            },
          },
        },
      })
    )
  );

  logSuccess(`${freelancers.length} freelancers en cours d'onboarding créés`);
  return freelancers;
}