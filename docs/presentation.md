Voici mon architecture
# 🔐 User Service - Architecture Complète

## 📁 Structure du Projet

```
services/user-service/
├── src/
│   ├── config/                 # Configuration
│   │   ├── database.ts         # Prisma client
│   │   ├── redis.ts            # Redis client
│   │   ├── env.ts              # Variables d'environnement
│   │   └── aws.ts              # AWS S3 config
│   │
│   ├── modules/                # Modules métier
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.dto.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── profile.controller.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── profile.routes.ts
│   │   │   └── profile.dto.ts
│   │   │
│   │   ├── reputation/
│   │   │   ├── reputation.controller.ts
│   │   │   ├── reputation.service.ts
│   │   │   ├── reputation.routes.ts
│   │   │   └── reputation.dto.ts
│   │   │
│   │   ├── onboarding/
│   │   │   ├── onboarding.controller.ts
│   │   │   ├── onboarding.service.ts
│   │   │   ├── onboarding.routes.ts
│   │   │   └── onboarding.dto.ts
│   │   │
│   │   └── reference/
│   │       ├── reference.controller.ts
│   │       ├── reference.service.ts
│   │       └── reference.routes.ts
│   │
│   ├── shared/                 # Code partagé
│   │   ├── middlewares/
│   │   │   ├── error-handler.ts
│   │   │   ├── validate.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── logger.ts
│   │   │   └── requireOnboarding.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   ├── hash.utils.ts
│   │   │   ├── email.utils.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── services/
│   │   │   ├── upload.service.ts
│   │   │   └── reference-data.service.ts
│   │   │
│   │   └── types/
│   │       ├── express.d.ts
│   │       └── common.types.ts
│   │
│   ├── prisma/                 # Prisma schema
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seeds/
│   │       └── onboarding.seed.ts
│   │
│   ├── app.ts                  # Express app
│   └── server.ts               # Entry point
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── Dockerfile
└── docker-compose.yml
```

---
Voici le contenu de certaines fichier que j'ai déjà crée

database.ts
import { PrismaClient } from 'generated/prisma';
import { env } from './env';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') globalThis.prisma = prisma;

regarde encore

env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').pipe(z.coerce.number()),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // AWS
  AWS_REGION: z.string().default('eu-west-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),
  
  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().pipe(z.coerce.number()),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  
  // URLs
  FRONTEND_URL: z.string().url(),
  API_GATEWAY_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

encore
import { createClient } from 'redis';
import { env } from './env';

export const redis = createClient({
  url: env.REDIS_URL,
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('✅ Redis connected'));

export const connectRedis = async () => {
  await redis.connect();
};

Les trois se torouvent dans config.ts

dans utils/helpers.ts, nous avons
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function logSection(title: string) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${title}`);
  console.log(`${'='.repeat(50)}\n`);
}

export function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

export function logInfo(message: string) {
  console.log(`ℹ️  ${message}`);
}

Voilà un peu