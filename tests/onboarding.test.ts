
// import request from 'supertest';
// import { createApp } from '../src/app';
// import { prisma } from '@config/database';
// import { redis } from '@config/redis';

// const app = createApp();

// describe('Onboarding Flow', () => {
//   let userId: string;
//   let accessToken: string;

//   beforeAll(async () => {
//     // Créer un utilisateur test
//     const user = await prisma.user.create({
//       data: {
//         email: 'onboarding@test.com',
//         password: 'hashedpassword',
//         firstName: 'Test',
//         lastName: 'User',
//         country: 'SN',
//         role: 'CLIENT',
//         profile: { create: {} },
//         reputation: { create: {} },
//       },
//     });
//     userId = user.id;

//     // Mock token (ou utiliser vraie génération)
//     accessToken = 'mock-jwt-token';
//   });

//   describe('POST /onboarding/initialize', () => {
//     it('should initialize onboarding', async () => {
//       const response = await request(app)
//         .post('/api/v1/onboarding/initialize')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data.currentStep).toBe(1);
//     });
//   });

//   describe('POST /onboarding/step-1', () => {
//     it('should save step 1 data', async () => {
//       const response = await request(app)
//         .post('/api/v1/onboarding/step-1')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .send({ serviceType: 'LOCAL' })
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data.currentStep).toBe(2);
//     });

//     it('should fail with invalid service type', async () => {
//       const response = await request(app)
//         .post('/api/v1/onboarding/step-1')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .send({ serviceType: 'INVALID' })
//         .expect(400);

//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('POST /onboarding/step-2', () => {
//     it('should save location data', async () => {
//       const response = await request(app)
//         .post('/api/v1/onboarding/step-2')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .send({
//           country: 'SN',
//           city: 'Dakar',
//           district: 'Plateau',
//           canTravel: true,
//           maxDistance: 10,
//         })
//         .expect(200);

//       expect(response.body.data.currentStep).toBe(3);
//     });
//   });

//   describe('GET /onboarding/progress', () => {
//     it('should get current progress', async () => {
//       const response = await request(app)
//         .get('/api/v1/onboarding/progress')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data).toHaveProperty('currentStep');
//       expect(response.body.data).toHaveProperty('completedSteps');
//     });
//   });

//   describe('PATCH /onboarding/go-to-step/:step', () => {
//     it('should navigate to specific step', async () => {
//       const response = await request(app)
//         .patch('/api/v1/onboarding/go-to-step/1')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(200);

//       expect(response.body.data.currentStep).toBe(1);
//     });

//     it('should fail with invalid step number', async () => {
//       await request(app)
//         .patch('/api/v1/onboarding/go-to-step/15')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(400);
//     });
//   });

//   describe('Reference Data', () => {
//     it('should get local categories', async () => {
//       const response = await request(app)
//         .get('/api/v1/reference/categories/local')
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(Array.isArray(response.body.data)).toBe(true);
//     });

//     it('should get languages', async () => {
//       const response = await request(app)
//         .get('/api/v1/reference/languages')
//         .expect(200);

//       expect(response.body.data).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({ code: 'fr', name: 'Français' })
//         ])
//       );
//     });
//   });
// });