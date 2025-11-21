import { Router } from 'express';
import { ProposalController } from './proposal.controller';
import { validate } from '@shared/middlewares/validate';
import {
  createProposalSchema,
  updateProposalSchema,
  respondToProposalSchema,
  getProposalsSchema,
} from './proposal.dto';
import { authenticate } from '@modules/auth/auth.middleware';
import { requireClient, requireFreelancer } from '@modules/missions/mission.middleware';

const router = Router();
const proposalController = new ProposalController();

// ===== PROTECTED ROUTES =====
router.use(authenticate); // Toutes les routes nécessitent authentification

// ===== FREELANCER ROUTES =====

// Créer une candidature (FREELANCER uniquement)
router.post(
  '/',
  requireFreelancer,
  validate(createProposalSchema),
  proposalController.createProposal
);

// Mes candidatures (FREELANCER uniquement)
router.get(
  '/my/proposals',
  requireFreelancer,
  validate(getProposalsSchema, 'query'),
  proposalController.getMyProposals
);

// Modifier une candidature (FREELANCER uniquement)
router.patch(
  '/:proposalId',
  requireFreelancer,
  validate(updateProposalSchema),
  proposalController.updateProposal
);

// Retirer une candidature (FREELANCER uniquement)
router.post(
  '/:proposalId/withdraw',
  requireFreelancer,
  proposalController.withdrawProposal
);

// ===== CLIENT ROUTES =====

// Voir les candidatures d'une mission (CLIENT uniquement)
router.get(
  '/mission/:missionId',
  requireClient,
  validate(getProposalsSchema, 'query'),
  proposalController.getProposalsForMission
);

// Accepter/Rejeter une candidature (CLIENT uniquement)
router.post(
  '/:proposalId/respond',
  requireClient,
  validate(respondToProposalSchema),
  proposalController.respondToProposal
);

// ===== COMMON ROUTES =====

// Voir une candidature spécifique (CLIENT ou FREELANCER concerné)
router.get('/:proposalId', proposalController.getProposalById);

export default router;