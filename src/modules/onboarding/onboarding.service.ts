import { prisma } from '@config/database';
import { redis } from '@config/redis';
import { AppError } from '@shared/utils/errors';
import type {
  Step1Data, Step2Data, Step3Data, Step4Data, Step5Data,
  Step6Data, Step7Data, Step8Data, Step9Data, Step10Data
} from './onboarding.dto';

export class OnboardingService {
  // Initialiser l'onboarding
  async initializeOnboarding(userId: string) {
    // Vérifier si déjà commencé
    const existing = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (existing) {
      return {
        message: 'Onboarding déjà commencé',
        currentStep: existing.currentStep,
        data: existing,
      };
    }

    // Créer nouveau
    const progress = await prisma.onboardingProgress.create({
      data: {
        userId,
        currentStep: 1,
        completedSteps: [],
      },
    });

    return {
      message: 'Onboarding initialisé',
      currentStep: 1,
      data: progress,
    };
  }

  // Récupérer la progression
  async getProgress(userId: string) {
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!progress) {
      throw new AppError('Onboarding non trouvé', 404);
    }

    return progress;
  }

  // ÉTAPE 1: Parcours
  async saveStep1(userId: string, data: Step1Data) {
    return this.saveStepData(userId, 1, { serviceType: data.serviceType });
  }

  // ÉTAPE 2: Localisation
  async saveStep2(userId: string, data: Step2Data) {
    return this.saveStepData(userId, 2, data);
  }

  // ÉTAPE 3: Expérience
  async saveStep3(userId: string, data: Step3Data) {
    return this.saveStepData(userId, 3, { experienceLevel: data.experienceLevel });
  }

  // ÉTAPE 4: Objectif
  async saveStep4(userId: string, data: Step4Data) {
    return this.saveStepData(userId, 4, { goal: data.goal });
  }

  // ÉTAPE 5: Compétences
  async saveStep5(userId: string, data: Step5Data) {
    return this.saveStepData(userId, 5, data);
  }

  // ÉTAPE 6: Éducation
  async saveStep6(userId: string, data: Step6Data) {
    return this.saveStepData(userId, 6, data);
  }

  // ÉTAPE 7: Langues
  async saveStep7(userId: string, data: Step7Data) {
    return this.saveStepData(userId, 7, data);
  }

  // ÉTAPE 8: Disponibilité
  async saveStep8(userId: string, data: Step8Data) {
    return this.saveStepData(userId, 8, data);
  }

  // ÉTAPE 9: Contact & Paiement
  async saveStep9(userId: string, data: Step9Data) {
    // Mettre à jour le phone dans User aussi
    await prisma.user.update({
      where: { id: userId },
      data: { phone: data.phone },
    });

    return this.saveStepData(userId, 9, data);
  }

  // ÉTAPE 10: Photo & Présentation
  async saveStep10(userId: string, data: Step10Data) {
    if (data.skipForNow) {
      return this.saveStepData(userId, 10, { skipped: true });
    }

    // Mettre à jour le profil utilisateur
    await prisma.profile.update({
      where: { userId },
      data: { bio: data.bio },
    });

    return this.saveStepData(userId, 10, { bio: data.bio });
  }

  // Finaliser l'onboarding
  async completeOnboarding(userId: string) {
    // Récupérer toutes les données
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new AppError('Onboarding non trouvé', 404);
    }

    if (progress.completedSteps.length < 9) { // Au moins 9 étapes (10 optionnelle)
      throw new AppError('Complète toutes les étapes requises', 400);
    }

    const formData = progress.formData as any;

    // Créer OnboardingData complet
    await prisma.onboardingData.create({
      data: {
        userId,
        serviceType: formData.step1?.serviceType,
        country: formData.step2?.country,
        city: formData.step2?.city,
        district: formData.step2?.district,
        canTravel: formData.step2?.canTravel || false,
        maxDistance: formData.step2?.maxDistance,
        experienceLevel: formData.step3?.experienceLevel,
        goal: formData.step4?.goal,
        selectedSkills: formData.step5?.selectedSkills || [],
        categories: formData.step5?.categories || [],
        educationLevel: formData.step6?.educationLevel,
        fieldOfStudy: formData.step6?.fieldOfStudy,
        languages: formData.step7?.languages || [],
        availability: formData.step8?.availability || [],
        hoursPerWeek: formData.step8?.hoursPerWeek,
        whatsappNumber: formData.step9?.whatsappNumber,
        paymentMethod: formData.step9?.paymentMethod,
        paymentDetails: formData.step9?.paymentDetails || {},
        emergencyContact: formData.step9?.emergencyContact || {},
        bio: formData.step10?.bio,
        profileCompleted: !formData.step10?.skipped,
      },
    });

    // Marquer comme complété
    await prisma.onboardingProgress.update({
      where: { userId },
      data: { isCompleted: true },
    });

    return { 
      message: 'Onboarding terminé avec succès !',
      completed: true 
    };
  }

  // Helper: Sauvegarder une étape
  private async saveStepData(userId: string, step: number, data: any) {
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new AppError('Onboarding non initialisé', 404);
    }

    // Merger les données
    const currentFormData = (progress.formData as any) || {};
    const updatedFormData = {
      ...currentFormData,
      [`step${step}`]: data,
    };

    // Ajouter l'étape aux complétées
    const completedSteps = Array.from(new Set([...progress.completedSteps, step]));
    const nextStep = step + 1 > 10 ? 10 : step + 1;

    // Update
    const updated = await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: nextStep,
        completedSteps,
        formData: updatedFormData,
      },
    });

    return {
      message: `Étape ${step} sauvegardée`,
      currentStep: nextStep,
      progress: (completedSteps.length / 10) * 100,
      data: updated,
    };
  }

  // Revenir à une étape précédente
  async goToStep(userId: string, step: number) {
    if (step < 1 || step > 10) {
      throw new AppError('Numéro d\'étape invalide', 400);
    }

    await prisma.onboardingProgress.update({
      where: { userId },
      data: { currentStep: step },
    });

    return { message: `Navigation vers étape ${step}`, currentStep: step };
  }
}
