
import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  country: z.string().min(2).optional(),
  language: z.enum(['fr', 'en', 'ar']).optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  portfolio: z.any().optional(),
});

export const getUsersQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  role: z.enum(['CLIENT', 'FREELANCER', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED']).optional(),
  country: z.string().optional(),
  search: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;