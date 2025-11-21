import { z } from 'zod';

// ===== CREATE PROPOSAL =====
export const createProposalSchema = z.object({
  missionId: z.string().cuid('ID de mission invalide'),
  coverLetter: z.string().min(100, 'Lettre de motivation minimum 100 caractères').max(1000, 'Maximum 1000 caractères'),
  proposedPrice: z.number().positive('Prix proposé doit être positif'),
  estimatedDelivery: z.number().int().positive('Délai de livraison doit être positif'),
  availableFrom: z.string().datetime().optional(),
});

// ===== UPDATE PROPOSAL =====
export const updateProposalSchema = z.object({
  coverLetter: z.string().min(100).max(1000).optional(),
  proposedPrice: z.number().positive().optional(),
  estimatedDelivery: z.number().int().positive().optional(),
  availableFrom: z.string().datetime().optional(),
});

// ===== ACCEPT/REJECT PROPOSAL =====
export const respondToProposalSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
  message: z.string().optional(),
});

// ===== GET PROPOSALS =====
export const getProposalsSchema = z.object({
  // CORRECTION : Les valeurs par défaut doivent être des nombres (1 et 10) après le pipe(z.number())
  page: z.string().transform(Number).pipe(z.number().positive()).default(1),
  limit: z.string().transform(Number).pipe(z.number().positive().max(50)).default(10),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
  missionId: z.string().cuid().optional(),
  sortBy: z.enum(['recent', 'price_asc', 'price_desc']).default('recent'),
});

// ===== TYPES =====
export type CreateProposalDto = z.infer<typeof createProposalSchema>;
export type UpdateProposalDto = z.infer<typeof updateProposalSchema>;
export type RespondToProposalDto = z.infer<typeof respondToProposalSchema>;
export type GetProposalsDto = z.infer<typeof getProposalsSchema>;