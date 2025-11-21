import { z } from 'zod';

// ÉTAPE 1: Parcours
export const step1Schema = z.object({
  serviceType: z.enum(['LOCAL', 'DIGITAL', 'BOTH']),
});

// ÉTAPE 2: Localisation
export const step2Schema = z.object({
  country: z.string().min(2, 'Pays requis'),
  city: z.string().min(2, 'Ville requise'),
  district: z.string().optional(),
  canTravel: z.boolean().optional(),
  maxDistance: z.number().int().positive().optional(),
});

// ÉTAPE 3: Expérience
export const step3Schema = z.object({
  experienceLevel: z.enum(['BEGINNER', 'EXPERIENCED', 'EXPERT']),
});

// ÉTAPE 4: Objectif
export const step4Schema = z.object({
  goal: z.enum(['MAIN_INCOME', 'SIDE_INCOME', 'BUILD_BUSINESS', 'LEARN_SKILLS']),
});

// ÉTAPE 5: Compétences
export const step5Schema = z.object({
  selectedSkills: z.array(z.string()).min(1, 'Sélectionne au moins une compétence'),
  categories: z.array(z.string()).min(1, 'Sélectionne au moins une catégorie'),
});

// ÉTAPE 6: Éducation
export const step6Schema = z.object({
  educationLevel: z.enum([
    'NONE', 
    'PRIMARY', 
    'SECONDARY', 
    'VOCATIONAL', 
    'UNIVERSITY', 
    'OTHER_CERTIFICATION'
  ]).optional(),
  fieldOfStudy: z.string().optional(),
});

// ÉTAPE 7: Langues
export const step7Schema = z.object({
  languages: z.array(z.object({
    code: z.string(), // 'fr', 'en', 'ar', etc.
    name: z.string(), // 'Français', 'English', etc.
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'FLUENT', 'NATIVE']),
  })).min(1, 'Sélectionne au moins une langue'),
});

// ÉTAPE 8: Disponibilité
export const step8Schema = z.object({
  availability: z.array(z.enum([
    'MORNING', 
    'AFTERNOON', 
    'EVENING', 
    'WEEKEND', 
    'FLEXIBLE'
  ])).min(1, 'Sélectionne au moins une plage horaire'),
  hoursPerWeek: z.number().int().positive().optional(),
});

// ÉTAPE 9: Contact & Paiement
export const step9Schema = z.object({
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  whatsappNumber: z.string().optional(),
  paymentMethod: z.enum(['MOBILE_MONEY', 'BANK_ACCOUNT', 'CASH']),
  paymentDetails: z.object({
    provider: z.string().optional(), // Orange Money, Wave, etc.
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
  }).optional(),
});

// ÉTAPE 10: Photo & Présentation
export const step10Schema = z.object({
  bio: z.string().min(20, 'Écris au moins 20 caractères').max(200, 'Maximum 200 caractères'),
  skipForNow: z.boolean().optional(),
});

// Export types
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;
export type Step9Data = z.infer<typeof step9Schema>;
export type Step10Data = z.infer<typeof step10Schema>;