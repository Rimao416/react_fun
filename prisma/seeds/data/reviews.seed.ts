import { PrismaClient, ReviewType } from '../../../src/generated/prisma';
import { ContractStatus } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';


export async function seedReviews(prisma: PrismaClient) {
  // Récupérer les missions validées
  const validatedContracts = await prisma.contract.findMany({
    where: { status: ContractStatus.COMPLETED, clientValidatedAt: { not: null } },
  });

  const reviewsData = [];

  for (const contract of validatedContracts) {
    // Review client → freelancer
    reviewsData.push({
      missionId: contract.missionId,
      reviewerId: contract.clientId,
      reviewedId: contract.freelancerId,
      type: ReviewType.CLIENT_TO_FREELANCER,
      rating: 5,
      communication: 5,
      quality: 5,
      professionalism: 5,
      punctuality: 5,
      comment: 'Excellent travail ! Professionnel, ponctuel et de grande qualité. Je recommande vivement.',
      isPublic: true,
    });

    // Review freelancer → client
    reviewsData.push({
      missionId: contract.missionId,
      reviewerId: contract.freelancerId,
      reviewedId: contract.clientId,
      type: ReviewType.FREELANCER_TO_CLIENT,
      rating: 5,
      communication: 5,
      professionalism: 5,
      comment: 'Client professionnel et sympathique. Paiement rapide. Merci !',
      isPublic: true,
    });
  }

  const reviews = await Promise.all(
    reviewsData.map((data) =>
      prisma.review.create({ data })
    )
  );

  logSuccess(`${reviews.length} avis créés`);
  return reviews;
}
