import { PrismaClient, ProposalStatus } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';

export async function seedProposals(prisma: PrismaClient, missions: any[], freelancers: any[]) {
  const proposalsData = [
    // Proposals pour Mission 1 (Nettoyage - PUBLISHED)
    {
      missionId: missions[0].id,
      freelancerId: freelancers.find((f: any) => f.email === 'ibrahima.fall@yahoo.fr')?.id,
      coverLetter: 'Bonjour, je suis spécialisé dans le nettoyage de bureaux avec 3 ans d\'expérience. Ponctuel et sérieux, je connais bien les techniques de nettoyage professionnel. Disponible immédiatement.',
      proposedPrice: 40000,
      estimatedDelivery: 4,
      availableFrom: new Date('2025-01-15'),
      status: ProposalStatus.PENDING,
    },
    
    // Proposals pour Mission 2 (Cuisine - PUBLISHED)
    {
      missionId: missions[1].id,
      freelancerId: freelancers.find((f: any) => f.email === 'aminata.ba@gmail.com')?.id,
      coverLetter: 'Bonjour ! Passionnée de cuisine sénégalaise depuis 15 ans. J\'ai déjà géré des événements traiteur pour 200+ personnes. Mon Thiéboudienne est très apprécié. Portfolio disponible.',
      proposedPrice: 70000,
      estimatedDelivery: 8,
      availableFrom: new Date('2025-01-20'),
      status: ProposalStatus.PENDING,
    },

    // Proposals pour Mission 3 (Design - IN_PROGRESS) - ACCEPTÉE
    {
      missionId: missions[2].id,
      freelancerId: freelancers.find((f: any) => f.email === 'marieme.sarr@outlook.com')?.id,
      coverLetter: 'Bonjour, designer avec 5 ans d\'expérience en branding. J\'ai déjà créé des identités visuelles pour plusieurs startups africaines. Je propose une approche moderne et sur-mesure.',
      proposedPrice: 350000,
      estimatedDelivery: 30,
      availableFrom: new Date('2024-12-20'),
      status: ProposalStatus.ACCEPTED,
      respondedAt: new Date('2024-12-18'),
    },

    // Proposals pour Mission 4 (Dev React - PUBLISHED)
    {
      missionId: missions[3].id,
      freelancerId: freelancers.find((f: any) => f.email === 'cheikh.sy@gmail.com')?.id,
      coverLetter: 'Bonjour, développeur React/React Native depuis 4 ans. J\'ai développé plusieurs apps mobiles en production. Maîtrise complète de l\'intégration API REST. Code propre et documenté.',
      proposedPrice: 750000,
      estimatedDelivery: 55,
      availableFrom: new Date('2025-01-10'),
      status: ProposalStatus.PENDING,
    },
    {
      missionId: missions[3].id,
      freelancerId: freelancers.find((f: any) => f.email === 'charles.ngono@gmail.com')?.id,
      coverLetter: 'Hello! Spécialisé en Flutter/React Native. Portfolio avec 10+ apps publiées. Livraison dans les délais garantie.',
      proposedPrice: 800000,
      estimatedDelivery: 60,
      availableFrom: new Date('2025-01-15'),
      status: ProposalStatus.PENDING,
    },

    // Proposals pour Mission 5 (Livraison - COMPLETED) - ACCEPTÉE
    {
      missionId: missions[4].id,
      freelancerId: freelancers.find((f: any) => f.email === 'moussa.kane@gmail.com')?.id,
      coverLetter: 'Bonjour, livreur professionnel avec moto en excellent état. Je connais Dakar par cœur. Très ponctuel et fiable. Disponible 7j/7.',
      proposedPrice: 5000,
      estimatedDelivery: 6,
      availableFrom: new Date('2024-12-01'),
      status: ProposalStatus.ACCEPTED,
      respondedAt: new Date('2024-12-02'),
    },

    // Proposals pour Mission 7 (Photo - VALIDATED) - ACCEPTÉE
    {
      missionId: missions[6].id,
      freelancerId: freelancers.find((f: any) => f.email === 'bintou.toure@gmail.com')?.id,
      coverLetter: 'Bonjour, photographe professionnelle événementiel. Équipement pro complet. Retouche incluse. Portfolio sur demande.',
      proposedPrice: 120000,
      estimatedDelivery: 8,
      availableFrom: new Date('2024-11-25'),
      status: ProposalStatus.ACCEPTED,
      respondedAt: new Date('2024-11-22'),
    },
  ];

  // Filtrer les proposals avec freelancerId valide
  const validProposals = proposalsData.filter((p) => p.freelancerId !== undefined);

  if (validProposals.length < proposalsData.length) {
    console.warn(`⚠️  ${proposalsData.length - validProposals.length} proposals ignorées (freelancers non trouvés)`);
  }

  const proposals = await Promise.all(
    validProposals.map((data) =>
      prisma.proposal.create({ data })
    )
  );

  // Mise à jour du nombre de propositions sur les missions
  const missionProposalCounts = validProposals.reduce((acc, p) => {
    acc[p.missionId] = (acc[p.missionId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  await Promise.all(
    Object.entries(missionProposalCounts).map(([missionId, count]) =>
      prisma.mission.update({
        where: { id: missionId },
        data: { proposalsCount: count },
      })
    )
  );

  logSuccess(`${proposals.length} propositions créées`);
  return proposals;
}