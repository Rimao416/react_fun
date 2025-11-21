// prisma/seeds/utils/cleanup.ts
import { PrismaClient } from '../../../src/generated/prisma';
import { logInfo, logSuccess } from './helpers';

// Définition d'un type pour l'assertion, représentant un modèle Prisma avec deleteMany
// Cela permet de résoudre l'erreur TS2349: This expression is not callable.
type PrismaModelCleaner = {
  deleteMany: (args?: any) => Promise<any>;
};

export async function cleanupDatabase(prisma: PrismaClient) {
  logInfo('Nettoyage de la base de données...');
  
  try {
    // Tentative de nettoyage dans l'ordre inverse des dépendances
 const tables = [
      { name: 'messages', model: prisma.message },
      { name: 'disputes', model: prisma.dispute },
      { name: 'reviews', model: prisma.review },
      { name: 'transactions', model: prisma.transaction },
      { name: 'payments', model: prisma.payment },
      { name: 'contracts', model: prisma.contract },
      { name: 'proposals', model: prisma.proposal },
      { name: 'missions', model: prisma.mission },
      { name: 'wallets', model: prisma.wallet },
      { name: 'onboardingData', model: prisma.onboardingData },
      { name: 'onboardingProgress', model: prisma.onboardingProgress },
      { name: 'refreshToken', model: prisma.refreshToken },
      { name: 'reputation', model: prisma.reputation },
      { name: 'profile', model: prisma.profile },
      { name: 'user', model: prisma.user },
    ];

    for (const table of tables) {
      try {
        // 🚀 CORRECTION : Utilisation de l'assertion de type pour indiquer
        // à TypeScript que 'table.model' possède bien la méthode 'deleteMany'.
        await (table.model as PrismaModelCleaner).deleteMany();
      } catch (error: any) {
        // Si la table n'existe pas (P2021), on continue
        if (error.code === 'P2021') {
          console.log(`⚠️  Table **${table.name}** n'existe pas encore (normal en première exécution)`);
        } else {
          throw error; // Relance l'erreur si ce n'est pas P2021
        }
      }
    }
    
    logSuccess('Base de données nettoyée\n');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}