import { Router } from 'express';
import { MissionController } from './mission.controller';
import { validate } from '@shared/middlewares/validate';
import {
  createMissionSchema,
  updateMissionSchema,
  searchMissionsSchema,
  closeMissionSchema,
} from './mission.dto';
import { authenticate } from '@modules/auth/auth.middleware';
import { requireClient } from './mission.middleware';

const router = Router();
const missionController = new MissionController();

// ===== PUBLIC ROUTES =====
// Rechercher des missions (accessible sans authentification)
router.get(
  '/search',
  validate(searchMissionsSchema, 'query'),
  missionController.searchMissions.bind(missionController)
);
// ===== PROTECTED ROUTES - CLIENT ONLY =====
router.use(authenticate); // Toutes les routes ci-dessous nécessitent authentification

// ⚠️ IMPORTANT : Routes spécifiques AVANT les routes avec paramètres dynamiques
// Mes missions (CLIENT uniquement)
router.get(
  '/my/missions',
  requireClient,
  missionController.getMyMissions.bind(missionController)
);

// Statistiques de mes missions (CLIENT uniquement)
router.get(
  '/my/stats',
  requireClient,
  missionController.getMissionStats.bind(missionController)
);

// Créer une mission (CLIENT uniquement)
router.post(
  '/',
  requireClient,
  validate(createMissionSchema),
  missionController.createMission.bind(missionController)
);

// Publier une mission (CLIENT uniquement)
router.post(
  '/:missionId/publish',
  requireClient,
  missionController.publishMission.bind(missionController)
);

// Fermer une mission (CLIENT uniquement)
router.post(
  '/:missionId/close',
  requireClient,
  validate(closeMissionSchema),
  missionController.closeMission.bind(missionController)
);

// Modifier une mission (CLIENT uniquement)
router.patch(
  '/:missionId',
  requireClient,
  validate(updateMissionSchema),
  missionController.updateMission.bind(missionController)
);

// Supprimer une mission (CLIENT uniquement)
router.delete(
  '/:missionId',
  requireClient,
  missionController.deleteMission.bind(missionController)
);

// ⚠️ Route avec paramètre dynamique EN DERNIER
// Voir une mission spécifique (authentifié mais pas forcément client)
router.get(
  '/:missionId',
  missionController.getMissionById.bind(missionController)
);

export default router;