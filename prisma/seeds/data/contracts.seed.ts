import { PrismaClient, ContractStatus, ProposalStatus, MissionStatus } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';

export async function seedContracts(prisma: PrismaClient, proposals: any[]) {
  // Récupérer les proposals acceptées
  const acceptedProposals = await prisma.proposal.findMany({
    where: { status: ProposalStatus.ACCEPTED },
    include: { mission: true, freelancer: true },
  });

  const contractsData = acceptedProposals.map((proposal) => {
    const platformFee = Number(proposal.proposedPrice) * 0.10; // 10% commission
    const freelancerEarnings = Number(proposal.proposedPrice) - platformFee;

    // Déterminer le statut selon la mission
    let status: ContractStatus = ContractStatus.ACTIVE;
    let workSubmittedAt: Date | null = null;
    let clientValidatedAt: Date | null = null;
    let actualEndDate: Date | null = null;

    if (proposal.mission.status === MissionStatus.COMPLETED) {
      status = ContractStatus.COMPLETED;
      workSubmittedAt = new Date('2024-12-20');
    } else if (proposal.mission.status === MissionStatus.VALIDATED) {
      status = ContractStatus.COMPLETED;
      workSubmittedAt = new Date('2024-11-28');
      clientValidatedAt = new Date('2024-11-29');
      actualEndDate = new Date('2024-11-29');
    }

    return {
      missionId: proposal.missionId,
      proposalId: proposal.id,
      clientId: proposal.mission.clientId,
      freelancerId: proposal.freelancerId,
      agreedPrice: proposal.proposedPrice,
      platformFee,
      freelancerEarnings,
      expectedEndDate: new Date(Date.now() + proposal.estimatedDelivery * 24 * 60 * 60 * 1000),
      status,
      workSubmittedAt,
      clientValidatedAt,
      actualEndDate,
    };
  });

  const contracts = await Promise.all(
    contractsData.map((data) =>
      prisma.contract.create({ data })
    )
  );

  logSuccess(`${contracts.length} contrats créés`);
  return contracts;
}