import { prisma } from '@config/database';
import { AppError } from '@shared/utils/errors';
import type { CreateProposalDto, UpdateProposalDto, RespondToProposalDto, GetProposalsDto } from './proposal.dto';
import { Prisma } from 'generated/prisma';

export class ProposalService {
  // ===== CREATE PROPOSAL =====
  async createProposal(freelancerId: string, data: CreateProposalDto) {
    // Vérifier que l'utilisateur est un FREELANCER
    const user = await prisma.user.findUnique({
      where: { id: freelancerId },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    if (user.role !== 'FREELANCER') {
      throw new AppError('Seuls les freelancers peuvent postuler', 403);
    }

    // Vérifier que la mission existe et est publiée
    const mission = await prisma.mission.findUnique({
      where: { id: data.missionId },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.status !== 'PUBLISHED') {
      throw new AppError('Cette mission n\'accepte plus de candidatures', 400);
    }

    // Vérifier que le freelancer n'est pas le client de la mission
    if (mission.clientId === freelancerId) {
      throw new AppError('Vous ne pouvez pas postuler à votre propre mission', 400);
    }

    // Vérifier qu'il n'a pas déjà postulé
    const existingProposal = await prisma.proposal.findUnique({
      where: {
        missionId_freelancerId: {
          missionId: data.missionId,
          freelancerId,
        },
      },
    });

    if (existingProposal) {
      throw new AppError('Vous avez déjà postulé à cette mission', 400);
    }

    // Créer la proposition
    const proposal = await prisma.$transaction(async (tx) => {
      const newProposal = await tx.proposal.create({
        data: {
          missionId: data.missionId,
          freelancerId,
          coverLetter: data.coverLetter,
          proposedPrice: data.proposedPrice,
          estimatedDelivery: data.estimatedDelivery,
          availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
          status: 'PENDING',
        },
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              budget: true,
            },
          },
          freelancer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              reputation: true,
              profile: true,
            },
          },
        },
      });

      // Incrémenter le compteur de propositions sur la mission
      await tx.mission.update({
        where: { id: data.missionId },
        data: { proposalsCount: { increment: 1 } },
      });

      return newProposal;
    });

    return proposal;
  }

  // ===== UPDATE PROPOSAL =====
  async updateProposal(proposalId: string, freelancerId: string, data: UpdateProposalDto) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { mission: true },
    });

    if (!proposal) {
      throw new AppError('Candidature non trouvée', 404);
    }

    if (proposal.freelancerId !== freelancerId) {
      throw new AppError('Non autorisé', 403);
    }

    // Ne peut modifier que si PENDING
    if (proposal.status !== 'PENDING') {
      throw new AppError('Candidature ne peut plus être modifiée', 400);
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        ...data,
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            budget: true,
          },
        },
      },
    });

    return updatedProposal;
  }

  // ===== WITHDRAW PROPOSAL =====
  async withdrawProposal(proposalId: string, freelancerId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new AppError('Candidature non trouvée', 404);
    }

    if (proposal.freelancerId !== freelancerId) {
      throw new AppError('Non autorisé', 403);
    }

    if (proposal.status !== 'PENDING') {
      throw new AppError('Candidature ne peut plus être retirée', 400);
    }

    const withdrawnProposal = await prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id: proposalId },
        data: { status: 'WITHDRAWN' },
      });

      // Décrémenter le compteur
      await tx.mission.update({
        where: { id: proposal.missionId },
        data: { proposalsCount: { decrement: 1 } },
      });

      return updated;
    });

    return withdrawnProposal;
  }

  // ===== RESPOND TO PROPOSAL (CLIENT) =====
  async respondToProposal(proposalId: string, clientId: string, data: RespondToProposalDto) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        mission: true,
        freelancer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new AppError('Candidature non trouvée', 404);
    }

    if (proposal.mission.clientId !== clientId) {
      throw new AppError('Non autorisé', 403);
    }

    if (proposal.status !== 'PENDING') {
      throw new AppError('Cette candidature a déjà été traitée', 400);
    }

if (data.action === 'ACCEPT') {
  const result = await prisma.$transaction(async (tx) => {
    const acceptedProposal = await tx.proposal.update({
      where: { id: proposalId },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date(),
      },
    });

    // Validation et conversion sécurisée
    const proposedPrice = proposal.proposedPrice 
      ? Number(proposal.proposedPrice) 
      : 0;

    if (proposedPrice <= 0) {
      throw new AppError('Prix proposé invalide', 400);
    }

    // Calculer la commission (10%)
    const platformFee = Math.round(proposedPrice * 0.1 * 100) / 100; // Arrondi à 2 décimales
    const freelancerEarnings = Math.round((proposedPrice - platformFee) * 100) / 100;

    const contract = await tx.contract.create({
      data: {
        missionId: proposal.missionId,
        proposalId: proposal.id,
        clientId,
        freelancerId: proposal.freelancerId,
        agreedPrice: proposedPrice,
        platformFee,
        freelancerEarnings,
        status: 'ACTIVE',
      },
    });

    await tx.mission.update({
      where: { id: proposal.missionId },
      data: { status: 'IN_PROGRESS' },
    });

    await tx.proposal.updateMany({
      where: {
        missionId: proposal.missionId,
        id: { not: proposalId },
        status: 'PENDING',
      },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
      },
    });

    return { acceptedProposal, contract };
  });

  return result;
}else {
      // Rejeter la candidature
      const rejectedProposal = await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          status: 'REJECTED',
          respondedAt: new Date(),
        },
      });

      return { rejectedProposal };
    }
  }

  // ===== GET PROPOSALS FOR MISSION (CLIENT) =====
  async getProposalsForMission(missionId: string, clientId: string, filters: GetProposalsDto) {
    // Vérifier que la mission appartient au client
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.clientId !== clientId) {
      throw new AppError('Non autorisé', 403);
    }

    const { page = 1, limit = 10, status, sortBy = 'recent' } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProposalWhereInput = {
      missionId,
      ...(status && { status }),
    };

    const orderBy: Prisma.ProposalOrderByWithRelationInput =
      sortBy === 'price_asc' ? { proposedPrice: 'asc' } :
      sortBy === 'price_desc' ? { proposedPrice: 'desc' } :
      { createdAt: 'desc' };

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          freelancer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              reputation: true,
              profile: true,
            },
          },
        },
      }),
      prisma.proposal.count({ where }),
    ]);

    return {
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== GET MY PROPOSALS (FREELANCER) =====
  async getMyProposals(freelancerId: string, filters: GetProposalsDto) {
    const { page = 1, limit = 10, status, sortBy = 'recent' } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProposalWhereInput = {
      freelancerId,
      ...(status && { status }),
    };

    const orderBy: Prisma.ProposalOrderByWithRelationInput =
      sortBy === 'price_asc' ? { proposedPrice: 'asc' } :
      sortBy === 'price_desc' ? { proposedPrice: 'desc' } :
      { createdAt: 'desc' };

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              budget: true,
              status: true,
              category: true,
              missionType: true,
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      prisma.proposal.count({ where }),
    ]);

    return {
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== GET PROPOSAL BY ID =====
  async getProposalById(proposalId: string, userId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        mission: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                reputation: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            reputation: true,
            profile: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new AppError('Candidature non trouvée', 404);
    }

    // Vérifier les droits d'accès
    const isFreelancer = proposal.freelancerId === userId;
    const isClient = proposal.mission.clientId === userId;

    if (!isFreelancer && !isClient) {
      throw new AppError('Non autorisé', 403);
    }

    return proposal;
  }
}