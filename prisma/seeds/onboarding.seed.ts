
// async function seedOnboardingData() {
//   console.log('🌱 Seeding onboarding data...');

//   // Créer utilisateur test avec onboarding complet
//   const user = await prisma.user.create({
//     data: {
//       email: 'complete@test.com',
//       password: 'hashedpassword',
//       firstName: 'Amadou',
//       lastName: 'Diallo',
//       country: 'SN',
//       role: 'FREELANCER',
//       emailVerified: true,
//       profile: {
//         create: {
//           bio: 'Développeur web passionné, 5 ans d\'expérience',
//         },
//       },
//       reputation: {
//         create: {},
//       },
//     },
//   });

//   // Créer progression complète
//   await prisma.onboardingProgress.create({
//     data: {
//       userId: user.id,
//       currentStep: 10,
//       completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//       isCompleted: true,
//       formData: {
//         step1: { serviceType: 'DIGITAL' },
//         step2: {
//           country: 'SN',
//           city: 'Dakar',
//           district: 'Plateau',
//           canTravel: true,
//           maxDistance: 20,
//         },
//         step3: { experienceLevel: 'EXPERIENCED' },
//         step4: { goal: 'MAIN_INCOME' },
//         step5: {
//           selectedSkills: ['web_dev', 'mobile_dev', 'ui_ux'],
//           categories: ['development', 'design'],
//         },
//         step6: {
//           educationLevel: 'UNIVERSITY',
//           fieldOfStudy: 'Informatique',
//         },
//         step7: {
//           languages: [
//             { code: 'fr', name: 'Français', level: 'NATIVE' },
//             { code: 'en', name: 'English', level: 'FLUENT' },
//             { code: 'wo', name: 'Wolof', level: 'NATIVE' },
//           ],
//         },
//         step8: {
//           availability: ['MORNING', 'AFTERNOON', 'FLEXIBLE'],
//           hoursPerWeek: 40,
//         },
//         step9: {
//           phone: '+221771234567',
//           whatsappNumber: '+221771234567',
//           paymentMethod: 'MOBILE_MONEY',
//           paymentDetails: {
//             provider: 'Orange Money',
//             accountNumber: '771234567',
//           },
//         },
//         step10: {
//           bio: 'Développeur web passionné, 5 ans d\'expérience',
//         },
//       },
//     },
//   });

//   // Créer données onboarding finales
//   await prisma.onboardingData.create({
//     data: {
//       userId: user.id,
//       serviceType: 'DIGITAL',
//       country: 'SN',
//       city: 'Dakar',
//       district: 'Plateau',
//       canTravel: true,
//       maxDistance: 20,
//       experienceLevel: 'EXPERIENCED',
//       goal: 'MAIN_INCOME',
//       selectedSkills: ['web_dev', 'mobile_dev', 'ui_ux'],
//       categories: ['development', 'design'],
//       educationLevel: 'UNIVERSITY',
//       fieldOfStudy: 'Informatique',
//       languages: [
//         { code: 'fr', name: 'Français', level: 'NATIVE' },
//         { code: 'en', name: 'English', level: 'FLUENT' },
//         { code: 'wo', name: 'Wolof', level: 'NATIVE' },
//       ],
//       availability: ['MORNING', 'AFTERNOON', 'FLEXIBLE'],
//       hoursPerWeek: 40,
//       whatsappNumber: '+221771234567',
//       paymentMethod: 'MOBILE_MONEY',
//       paymentDetails: {
//         provider: 'Orange Money',
//         accountNumber: '771234567',
//       },
//       emergencyContact: {
//         name: 'Fatou Diallo',
//         phone: '+221779876543',
//       },
//       bio: 'Développeur web passionné, 5 ans d\'expérience',
//       profileCompleted: true,
//     },
//   });

//   console.log('✅ Onboarding data seeded');
// }

// seedOnboardingData()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });