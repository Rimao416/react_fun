import { prisma } from '@config/database';
import { AppError } from '@shared/utils/errors';
import type { CreateMissionDto, UpdateMissionDto, SearchMissionsDto, CloseMissionDto } from './mission.dto';
import { Prisma } from 'generated/prisma';

export class MissionService {
  // ===== CREATE MISSION =====
  async createMission(clientId: string, data: CreateMissionDto) {
    // Vérifier que l'utilisateur est un CLIENT
    const user = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    if (user.role !== 'CLIENT') {
      throw new AppError('Seuls les clients peuvent créer des missions', 403);
    }

    // Créer la mission
    const mission = await prisma.mission.create({
      data: {
        clientId,
        title: data.title,
        description: data.description,
        missionType: data.missionType,
        category: data.category,
        budget: data.budget,
        currency: data.currency || 'EUR',
        isRecurring: data.isRecurring,
        recurringDetails: data.recurringDetails,
        estimatedDuration: data.estimatedDuration,
        isLocal: data.isLocal,
        location: data.location,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        maxDistance: data.maxDistance,
        requiredSkills: data.requiredSkills,
        experienceLevel: data.experienceLevel,
        startDate: data.startDate ? new Date(data.startDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        preferredSchedule: data.preferredSchedule,
        attachments: data.attachments,
        status: 'DRAFT',
      },
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
    });

    return mission;
  }

  // ===== UPDATE MISSION =====
  async updateMission(missionId: string, clientId: string, data: UpdateMissionDto) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.clientId !== clientId) {
      throw new AppError('Non autorisé à modifier cette mission', 403);
    }

    // Ne peut pas modifier une mission qui n'est plus en DRAFT ou PUBLISHED
    if (!['DRAFT', 'PUBLISHED'].includes(mission.status)) {
      throw new AppError('Mission ne peut plus être modifiée', 400);
    }

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return updatedMission;
  }

  // ===== PUBLISH MISSION =====
  async publishMission(missionId: string, clientId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.clientId !== clientId) {
      throw new AppError('Non autorisé', 403);
    }

    if (mission.status !== 'DRAFT') {
      throw new AppError('Seules les missions en brouillon peuvent être publiées', 400);
    }

    const publishedMission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
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
    });

    return publishedMission;
  }

  // ===== GET MISSION BY ID =====
  async getMissionById(missionId: string, userId?: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
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
        proposals: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
        contract: {
          include: {
            freelancer: {
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
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    // Incrémenter le nombre de vues si ce n'est pas le client
    if (userId !== mission.clientId) {
      await prisma.mission.update({
        where: { id: missionId },
        data: { viewsCount: { increment: 1 } },
      });
    }

    // Masquer les candidatures si l'utilisateur n'est pas le client
    if (userId !== mission.clientId) {
      delete (mission as any).proposals;
    }

    return mission;
  }

  // ===== SEARCH MISSIONS =====
  async searchMissions(filters: SearchMissionsDto, userId?: string) {
    const { page = 1, limit = 10, sortBy = 'recent', skills, ...otherFilters } = filters;
    const skip = (page - 1) * limit;

    // Construire les filtres WHERE
    const where: Prisma.MissionWhereInput = {
      status: otherFilters.status || 'PUBLISHED',
      ...(otherFilters.missionType && { missionType: otherFilters.missionType }),
      ...(otherFilters.category && { category: otherFilters.category }),
      ...(otherFilters.experienceLevel && { experienceLevel: otherFilters.experienceLevel }),
      ...(otherFilters.location && { location: { contains: otherFilters.location, mode: 'insensitive' } }),
      ...(otherFilters.minBudget && { budget: { gte: otherFilters.minBudget } }),
      ...(otherFilters.maxBudget && { budget: { lte: otherFilters.maxBudget } }),
      ...(skills && {
        requiredSkills: {
          hasSome: skills.split(',').map(s => s.trim()),
        },
      }),
    };

    // Construire l'ORDER BY
    const orderBy: Prisma.MissionOrderByWithRelationInput = 
      sortBy === 'budget_asc' ? { budget: 'asc' } :
      sortBy === 'budget_desc' ? { budget: 'desc' } :
      sortBy === 'deadline' ? { deadline: 'asc' } :
      { createdAt: 'desc' };

    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
          _count: {
            select: {
              proposals: true,
            },
          },
        },
      }),
      prisma.mission.count({ where }),
    ]);

    return {
      missions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== GET MY MISSIONS (CLIENT) =====
  async getMyMissions(clientId: string, status?: string) {
    const where: Prisma.MissionWhereInput = {
      clientId,
      ...(status && { status: status as any }),
    };

    const missions = await prisma.mission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            proposals: true,
          },
        },
        contract: {
          include: {
            freelancer: {
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
    });

    return missions;
  }

  // ===== CLOSE MISSION =====
  async closeMission(missionId: string, clientId: string, data?: CloseMissionDto) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { contract: true },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.clientId !== clientId) {
      throw new AppError('Non autorisé', 403);
    }

    // Vérifier si la mission peut être fermée
    if (mission.contract && mission.contract.status === 'ACTIVE') {
      throw new AppError('Impossible de fermer une mission avec un contrat actif', 400);
    }

    const closedMission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    return closedMission;
  }

  // ===== DELETE MISSION =====
  async deleteMission(missionId: string, clientId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { proposals: true, contract: true },
    });

    if (!mission) {
      throw new AppError('Mission non trouvée', 404);
    }

    if (mission.clientId !== clientId) {
      throw new AppError('Non autorisé', 403);
    }

    // Ne peut supprimer que les missions en DRAFT sans candidatures
    if (mission.status !== 'DRAFT' || mission.proposals.length > 0) {
      throw new AppError('Impossible de supprimer cette mission', 400);
    }

    await prisma.mission.delete({
      where: { id: missionId },
    });

    return { message: 'Mission supprimée avec succès' };
  }

  // ===== GET MISSION STATS (CLIENT) =====
  async getMissionStats(clientId: string) {
    const [total, draft, published, inProgress, completed] = await Promise.all([
      prisma.mission.count({ where: { clientId } }),
      prisma.mission.count({ where: { clientId, status: 'DRAFT' } }),
      prisma.mission.count({ where: { clientId, status: 'PUBLISHED' } }),
      prisma.mission.count({ where: { clientId, status: 'IN_PROGRESS' } }),
      prisma.mission.count({ where: { clientId, status: 'COMPLETED' } }),
    ]);

    return {
      total,
      draft,
      published,
      inProgress,
      completed,
    };
  }
}