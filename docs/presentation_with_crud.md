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
On est sur du NodeJs, Docker, Express, Prisma

Tu vas m'implementer ceci

# ICI LA Tache à implementer

Regarde un exemple
import { Request, Response } from 'express';
import { MissionService } from './mission.service';
import type { CreateMissionDto, UpdateMissionDto, SearchMissionsDto, CloseMissionDto } from './mission.dto';

export class MissionController {
  private missionService = new MissionService();

  // ===== CREATE MISSION =====
  createMission = async (req: Request<{}, {}, CreateMissionDto>, res: Response) => {
    const clientId = req.user!.userId;
    const mission = await this.missionService.createMission(clientId, req.body);

    res.status(201).json({
      success: true,
      data: mission,
      message: 'Mission créée avec succès',
    });
  };

  // ===== UPDATE MISSION =====
  updateMission = async (
    req: Request<{ missionId: string }, {}, UpdateMissionDto>,
    res: Response
  ) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.updateMission(missionId, clientId, req.body);

    res.json({
      success: true,
      data: mission,
      message: 'Mission mise à jour avec succès',
    });
  };

  // ===== PUBLISH MISSION =====
  publishMission = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.publishMission(missionId, clientId);

    res.json({
      success: true,
      data: mission,
      message: 'Mission publiée avec succès',
    });
  };

  // ===== GET MISSION BY ID =====
  getMissionById = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const userId = req.user?.userId;

    const mission = await this.missionService.getMissionById(missionId, userId);

    res.json({
      success: true,
      data: mission,
    });
  };

  // ===== SEARCH MISSIONS =====
// Dans mission.controller.ts
searchMissions = async (
  req: Request<{}, {}, {}, any>, // ou ParsedQs au lieu de any
  res: Response
) => {
  const userId = req.user?.userId;
  // Le middleware validate a déjà transformé req.query en SearchMissionsDto
  const result = await this.missionService.searchMissions(
    req.query as SearchMissionsDto, 
    userId
  );
  res.json({
    success: true,
    data: result.missions,
    pagination: result.pagination,
  });
};
  // ===== GET MY MISSIONS =====
  getMyMissions = async (req: Request, res: Response) => {
    const clientId = req.user!.userId;
    const { status } = req.query;

    const missions = await this.missionService.getMyMissions(
      clientId,
      status as string | undefined
    );

    res.json({
      success: true,
      data: missions,
    });
  };

  // ===== CLOSE MISSION =====
  closeMission = async (
    req: Request<{ missionId: string }, {}, CloseMissionDto>,
    res: Response
  ) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.closeMission(missionId, clientId, req.body);

    res.json({
      success: true,
      data: mission,
      message: 'Mission fermée avec succès',
    });
  };

  // ===== DELETE MISSION =====
  deleteMission = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const result = await this.missionService.deleteMission(missionId, clientId);

    res.json({
      success: true,
      data: result,
    });
  };

  // ===== GET MISSION STATS =====
  getMissionStats = async (req: Request, res: Response) => {
    const clientId = req.user!.userId;
    const stats = await this.missionService.getMissionStats(clientId);

    res.json({
      success: true,
      data: stats,
    });
  };
}
encore
import { z } from 'zod';

// ===== CREATE MISSION =====
export const createMissionSchema = z.object({
  title: z.string().min(10, 'Titre minimum 10 caractères').max(100, 'Titre maximum 100 caractères'),
  description: z.string().min(50, 'Description minimum 50 caractères'),
  missionType: z.enum(['LOCAL_SERVICE', 'DIGITAL_SERVICE']),
  category: z.string().min(1, 'Catégorie requise'),

  // Budget
  budget: z.number().positive('Budget doit être positif'),
  currency: z.string().default('EUR'),
  isRecurring: z.boolean().default(false),
  recurringDetails: z.any().optional(),
  estimatedDuration: z.number().positive().optional(),

  // Localisation (pour missions locales)
  isLocal: z.boolean().default(false),
  location: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxDistance: z.number().positive().optional(),

  // Compétences
  requiredSkills: z.array(z.string()).min(1, 'Au moins une compétence requise'),
  experienceLevel: z.enum(['BEGINNER', 'EXPERIENCED', 'EXPERT']).optional(),

  // Dates
  startDate: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
  preferredSchedule: z.any().optional(),

  // Attachements
  attachments: z.any().optional(),
}).refine(
  (data) => {
    if (data.isLocal) {
      return data.location && data.address;
    }
    return true;
  },
  {
    message: 'Location et address sont requis pour les missions locales',
    path: ['location'],
  }
);

// ===== UPDATE MISSION =====
export const updateMissionSchema = createMissionSchema.partial();

// ===== PUBLISH MISSION =====
export const publishMissionSchema = z.object({
  missionId: z.string().cuid(),
});

// ===== SEARCH MISSIONS =====
export const searchMissionsSchema = z.object({
  // Les defaults doivent être AVANT la transformation
  page: z.string().optional().default('1').transform(Number).pipe(z.number().positive()),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().positive().max(50)),
  
  missionType: z.enum(['LOCAL_SERVICE', 'DIGITAL_SERVICE']).optional(),
  category: z.string().optional(),
  
  minBudget: z.string().optional().transform((val) => val ? Number(val) : undefined).pipe(z.number().positive().optional()),
  maxBudget: z.string().optional().transform((val) => val ? Number(val) : undefined).pipe(z.number().positive().optional()),
  
  experienceLevel: z.enum(['BEGINNER', 'EXPERIENCED', 'EXPERT']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'VALIDATED', 'DISPUTED', 'CANCELLED', 'CLOSED']).optional(),
  
  skills: z.string().optional(), // Comma-separated
  location: z.string().optional(),
  
  maxDistance: z.string().optional().transform((val) => val ? Number(val) : undefined).pipe(z.number().positive().optional()),
  
  sortBy: z.enum(['recent', 'budget_asc', 'budget_desc', 'deadline']).optional().default('recent'),
});

// ===== CLOSE MISSION =====
export const closeMissionSchema = z.object({
  reason: z.string().optional(),
});

// ===== TYPES =====
export type CreateMissionDto = z.infer<typeof createMissionSchema>;
export type UpdateMissionDto = z.infer<typeof updateMissionSchema>;
export type SearchMissionsDto = z.infer<typeof searchMissionsSchema>;
export type CloseMissionDto = z.infer<typeof closeMissionSchema>;

encore
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/utils/errors';

/**
 * Middleware pour vérifier que l'utilisateur est un CLIENT
 */
export const requireClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  if (req.user.role !== 'CLIENT') {
    throw new AppError('Cette action est réservée aux clients', 403);
  }

  next();
};

/**
 * Middleware pour vérifier que l'utilisateur est un FREELANCER
 */
export const requireFreelancer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  if (req.user.role !== 'FREELANCER') {
    throw new AppError('Cette action est réservée aux freelancers', 403);
  }

  next();
};

/**
 * Middleware pour vérifier que l'email est vérifié
 */
export const requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  // Cette vérification devrait être faite en récupérant l'utilisateur depuis la DB
  // Pour l'instant on la laisse passer, mais à implémenter si nécessaire
  next();
};
encore
import { Router } from 'express';
import { MissionController } from './mission.controller';
import { validate } from '@shared/middlewares/validate';
import {
  createMissionSchema,
  updateMissionSchema,
  searchMissionsSchema,
  closeMissionSchema,
} from './mission.dto';
import { authenticate } from '@modules/auth/auth.middleware';
import { requireClient } from './mission.middleware';

const router = Router();
const missionController = new MissionController();

// ===== PUBLIC ROUTES =====
// Rechercher des missions (accessible sans authentification)
router.get(
  '/search',
  validate(searchMissionsSchema, 'query'),
  missionController.searchMissions.bind(missionController)
);
// ===== PROTECTED ROUTES - CLIENT ONLY =====
router.use(authenticate); // Toutes les routes ci-dessous nécessitent authentification

// ⚠️ IMPORTANT : Routes spécifiques AVANT les routes avec paramètres dynamiques
// Mes missions (CLIENT uniquement)
router.get(
  '/my/missions',
  requireClient,
  missionController.getMyMissions.bind(missionController)
);

// Statistiques de mes missions (CLIENT uniquement)
router.get(
  '/my/stats',
  requireClient,
  missionController.getMissionStats.bind(missionController)
);

// Créer une mission (CLIENT uniquement)
router.post(
  '/',
  requireClient,
  validate(createMissionSchema),
  missionController.createMission.bind(missionController)
);

// Publier une mission (CLIENT uniquement)
router.post(
  '/:missionId/publish',
  requireClient,
  missionController.publishMission.bind(missionController)
);

// Fermer une mission (CLIENT uniquement)
router.post(
  '/:missionId/close',
  requireClient,
  validate(closeMissionSchema),
  missionController.closeMission.bind(missionController)
);

// Modifier une mission (CLIENT uniquement)
router.patch(
  '/:missionId',
  requireClient,
  validate(updateMissionSchema),
  missionController.updateMission.bind(missionController)
);

// Supprimer une mission (CLIENT uniquement)
router.delete(
  '/:missionId',
  requireClient,
  missionController.deleteMission.bind(missionController)
);

// ⚠️ Route avec paramètre dynamique EN DERNIER
// Voir une mission spécifique (authentifié mais pas forcément client)
router.get(
  '/:missionId',
  missionController.getMissionById.bind(missionController)
);

export default router;

encore
import { prisma } from '@config/database';
import { AppError } from '@shared/utils/errors';
import type { CreateMissionDto, UpdateMissionDto, SearchMissionsDto, CloseMissionDto } from './mission.dto';
import { Prisma } from 'generated/prisma';

export class MissionService {
  // ===== CREATE MISSION =====
  async createMission(clientId: string, data: CreateMissionDto) {
    // Vérifier que l'utilisateur est un CLIENT
    const user = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    if (user.role !== 'CLIENT') {
      throw new AppError('Seuls les clients peuvent créer des missions', 403);
    }

    // Créer la mission
    const mission = await prisma.mission.create({
      data: {
        clientId,
        title: data.title,
        description: data.description,
        missionType: data.missionType,
        category: data.category,
        budget: data.budget,
        currency: data.currency || 'EUR',
        isRecurring: data.isRecurring,
        recurringDetails: data.recurringDetails,
        estimatedDuration: data.estimatedDuration,
        isLocal: data.isLocal,
        location: data.location,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        maxDistance: data.maxDistance,
        requiredSkills: data.requiredSkills,
        experienceLevel: data.experienceLevel,
        startDate: data.startDate ? new Date(data.startDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        preferredSchedule: data.preferredSchedule,
        attachments: data.attachments,
        status: 'DRAFT',
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            reputation: true,
          },
        },
      },
    });

    return mission;
  }

