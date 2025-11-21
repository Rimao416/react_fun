import { Request, Response } from 'express';
import { MissionService } from './mission.service';
import type { CreateMissionDto, UpdateMissionDto, SearchMissionsDto, CloseMissionDto } from './mission.dto';

export class MissionController {
  private missionService = new MissionService();

  // ===== CREATE MISSION =====
  createMission = async (req: Request<{}, {}, CreateMissionDto>, res: Response) => {
    const clientId = req.user!.userId;
    const mission = await this.missionService.createMission(clientId, req.body);

    res.status(201).json({
      success: true,
      data: mission,
      message: 'Mission créée avec succès',
    });
  };

  // ===== UPDATE MISSION =====
  updateMission = async (
    req: Request<{ missionId: string }, {}, UpdateMissionDto>,
    res: Response
  ) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.updateMission(missionId, clientId, req.body);

    res.json({
      success: true,
      data: mission,
      message: 'Mission mise à jour avec succès',
    });
  };

  // ===== PUBLISH MISSION =====
  publishMission = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.publishMission(missionId, clientId);

    res.json({
      success: true,
      data: mission,
      message: 'Mission publiée avec succès',
    });
  };

  // ===== GET MISSION BY ID =====
  getMissionById = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const userId = req.user?.userId;

    const mission = await this.missionService.getMissionById(missionId, userId);

    res.json({
      success: true,
      data: mission,
    });
  };

  // ===== SEARCH MISSIONS =====
// Dans mission.controller.ts
searchMissions = async (
  req: Request<{}, {}, {}, any>, // ou ParsedQs au lieu de any
  res: Response
) => {
  const userId = req.user?.userId;
  // Le middleware validate a déjà transformé req.query en SearchMissionsDto
  const result = await this.missionService.searchMissions(
    req.query as SearchMissionsDto, 
    userId
  );
  res.json({
    success: true,
    data: result.missions,
    pagination: result.pagination,
  });
};
  // ===== GET MY MISSIONS =====
  getMyMissions = async (req: Request, res: Response) => {
    const clientId = req.user!.userId;
    const { status } = req.query;

    const missions = await this.missionService.getMyMissions(
      clientId,
      status as string | undefined
    );

    res.json({
      success: true,
      data: missions,
    });
  };

  // ===== CLOSE MISSION =====
  closeMission = async (
    req: Request<{ missionId: string }, {}, CloseMissionDto>,
    res: Response
  ) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const mission = await this.missionService.closeMission(missionId, clientId, req.body);

    res.json({
      success: true,
      data: mission,
      message: 'Mission fermée avec succès',
    });
  };

  // ===== DELETE MISSION =====
  deleteMission = async (req: Request<{ missionId: string }>, res: Response) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const result = await this.missionService.deleteMission(missionId, clientId);

    res.json({
      success: true,
      data: result,
    });
  };

  // ===== GET MISSION STATS =====
  getMissionStats = async (req: Request, res: Response) => {
    const clientId = req.user!.userId;
    const stats = await this.missionService.getMissionStats(clientId);

    res.json({
      success: true,
      data: stats,
    });
  };
}