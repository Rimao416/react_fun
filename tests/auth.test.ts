// import request from 'supertest';
// import { createApp } from '../src/app';
// import {prisma} from '@config/database';
// import { hashPassword } from '@shared/utils/hash.utils';

// const app = createApp();

// describe('Auth Module', () => {
//   describe('POST /api/v1/auth/register', () => {
//     it('should register a new user successfully', async () => {
//       const userData = {
//         email: 'test@example.com',
//         password: 'Test123456',
//         firstName: 'John',
//         lastName: 'Doe',
//         country: 'SN',
//         role: 'CLIENT',
//       };

//       const response = await request(app)
//         .post('/api/v1/auth/register')
//         .send(userData)
//         .expect(201);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data.user.email).toBe(userData.email);
//       expect(response.body.data.tokens).toHaveProperty('accessToken');
//       expect(response.body.data.tokens).toHaveProperty('refreshToken');
//       expect(response.body.data.user).not.toHaveProperty('password');
//     });

//     it('should fail with weak password', async () => {
//       const userData = {
//         email: 'test@example.com',
//         password: 'weak',
//         firstName: 'John',
//         lastName: 'Doe',
//         country: 'SN',
//       };

//       const response = await request(app)
//         .post('/api/v1/auth/register')
//         .send(userData)
//         .expect(400);

//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toContain('Validation');
//     });

//     it('should fail with duplicate email', async () => {
//       const userData = {
//         email: 'test@example.com',
//         password: 'Test123456',
//         firstName: 'John',
//         lastName: 'Doe',
//         country: 'SN',
//       };

//       // First registration
//       await request(app).post('/api/v1/auth/register').send(userData);

//       // Second registration with same email
//       const response = await request(app)
//         .post('/api/v1/auth/register')
//         .send(userData)
//         .expect(409);

//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toContain('déjà utilisé');
//     });
//   });

//   describe('POST /api/v1/auth/login', () => {
//     beforeEach(async () => {
//       // Create a test user
//       const hashedPassword = await hashPassword('Test123456');
//       await prisma.user.create({
//         data: {
//           email: 'test@example.com',
//           password: hashedPassword,
//           firstName: 'John',
//           lastName: 'Doe',
//           country: 'SN',
//           role: 'CLIENT',
//           profile: { create: {} },
//           reputation: { create: {} },
//         },
//       });
//     });

//     it('should login successfully with valid credentials', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: 'test@example.com',
//           password: 'Test123456',
//         })
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data.tokens).toHaveProperty('accessToken');
//       expect(response.body.data.tokens).toHaveProperty('refreshToken');
//     });

//     it('should fail with invalid email', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: 'wrong@example.com',
//           password: 'Test123456',
//         })
//         .expect(401);

//       expect(response.body.success).toBe(false);
//       expect(response.body.message).toContain('incorrect');
//     });

//     it('should fail with invalid password', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: 'test@example.com',
//           password: 'WrongPassword123',
//         })
//         .expect(401);

//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('GET /api/v1/auth/me', () => {
//     let accessToken: string;

//     beforeEach(async () => {
//       const hashedPassword = await hashPassword('Test123456');
//       await prisma.user.create({
//         data: {
//           email: 'test@example.com',
//           password: hashedPassword,
//           firstName: 'John',
//           lastName: 'Doe',
//           country: 'SN',
//           role: 'CLIENT',
//           profile: { create: {} },
//           reputation: { create: {} },
//         },
//       });

//       const loginResponse = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: 'test@example.com',
//           password: 'Test123456',
//         });

//       accessToken = loginResponse.body.data.tokens.accessToken;
//     });

//     it('should get current user profile', async () => {
//       const response = await request(app)
//         .get('/api/v1/auth/me')
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(200);

//       expect(response.body.success).toBe(true);
//       expect(response.body.data.email).toBe('test@example.com');
//       expect(response.body.data).toHaveProperty('profile');
//       expect(response.body.data).toHaveProperty('reputation');
//     });

//     it('should fail without token', async () => {
//       const response = await request(app)
//         .get('/api/v1/auth/me')
//         .expect(401);

//       expect(response.body.success).toBe(false);
//     });

//     it('should fail with invalid token', async () => {
//       const response = await request(app)
//         .get('/api/v1/auth/me')
//         .set('Authorization', 'Bearer invalid-token')
//         .expect(401);

//       expect(response.body.success).toBe(false);
//     });
//   });
// });