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