import { PrismaClient, UserRole } from '../../src/generated/prisma';
import { cleanupDatabase } from './utils/cleanup';
import { logSection, logSuccess, logInfo } from './utils/helpers';
import {
  seedAdmin,
  seedClients,
  seedLocalFreelancers,
  seedDigitalFreelancers,
  seedMixedFreelancers,
  seedOnboardingFreelancers,
  seedInternationalFreelancers,
  seedMissions,
  seedProposals,
  seedContracts,
  seedWallets,
  seedPayments,
  seedReviews,
} from './data';

const prisma = new PrismaClient();

async function main() {
  try {
    logSection('🌱 Début du seeding de la base de données Siyé');

    // 1. Nettoyage
    await cleanupDatabase(prisma);

    // 2. Création Utilisateurs
    logInfo('Création de l\'administrateur...');
    const admin = await seedAdmin(prisma);

    logInfo('Création des clients...');
    const clients = await seedClients(prisma);

    logInfo('Création des freelancers...');
    const localFreelancers = await seedLocalFreelancers(prisma);
    const digitalFreelancers = await seedDigitalFreelancers(prisma);
    const mixedFreelancers = await seedMixedFreelancers(prisma);
    const onboardingFreelancers = await seedOnboardingFreelancers(prisma);
    const internationalFreelancers = await seedInternationalFreelancers(prisma);

    const allFreelancers = [
      ...localFreelancers,
      ...digitalFreelancers,
      ...mixedFreelancers,
      ...internationalFreelancers,
    ];

    const allUsers = [admin, ...clients, ...allFreelancers, ...onboardingFreelancers];

    // 3. Création Missions & Marketplace
    logInfo('Création des missions...');
    const missions = await seedMissions(prisma, clients, allFreelancers);

    logInfo('Création des propositions...');
    const proposals = await seedProposals(prisma, missions, allFreelancers);

    logInfo('Création des contrats...');
    const contracts = await seedContracts(prisma, proposals);

    logInfo('Création des portefeuilles...');
    await seedWallets(prisma, allUsers);

    logInfo('Création des paiements...');
    await seedPayments(prisma, contracts);

    logInfo('Création des avis...');
    await seedReviews(prisma);

    // 4. Statistiques
    await displayStatistics(prisma);

    logSection('✅ SEEDING TERMINÉ AVEC SUCCÈS !');
    displayCredentials();
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function displayStatistics(prisma: PrismaClient) {
  logSection('📊 Statistiques');
  
  const stats = {
    users: await prisma.user.count(),
    clients: await prisma.user.count({ where: { role: UserRole.CLIENT } }),
    freelancers: await prisma.user.count({ where: { role: UserRole.FREELANCER } }),
    missions: await prisma.mission.count(),
    proposals: await prisma.proposal.count(),
    contracts: await prisma.contract.count(),
    payments: await prisma.payment.count(),
    reviews: await prisma.review.count(),
    wallets: await prisma.wallet.count(),
  };

  console.log(`   • Total utilisateurs : ${stats.users}`);
  console.log(`   • Clients : ${stats.clients}`);
  console.log(`   • Freelancers : ${stats.freelancers}`);
  console.log(`   • Missions : ${stats.missions}`);
  console.log(`   • Propositions : ${stats.proposals}`);
  console.log(`   • Contrats actifs : ${stats.contracts}`);
  console.log(`   • Paiements : ${stats.payments}`);
  console.log(`   • Avis : ${stats.reviews}`);
  console.log(`   • Portefeuilles : ${stats.wallets}`);
}

function displayCredentials() {
  logSection('🔐 Identifiants de connexion');
  console.log('Email: admin@siye.africa | mamadou.diop@gmail.com | aminata.ba@gmail.com');
  console.log('Password: Password123!\n');
}

main();