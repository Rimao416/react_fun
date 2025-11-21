import { Request, Response } from 'express';
import { ProposalService } from './proposal.service';
import type { CreateProposalDto, UpdateProposalDto, RespondToProposalDto, GetProposalsDto } from './proposal.dto';

export class ProposalController {
  private proposalService = new ProposalService();

  // ===== CREATE PROPOSAL (FREELANCER) =====
  createProposal = async (req: Request<{}, {}, CreateProposalDto>, res: Response) => {
    const freelancerId = req.user!.userId;
    const proposal = await this.proposalService.createProposal(freelancerId, req.body);

    res.status(201).json({
      success: true,
      data: proposal,
      message: 'Candidature envoyée avec succès',
    });
  };

  // ===== UPDATE PROPOSAL (FREELANCER) =====
  updateProposal = async (
    req: Request<{ proposalId: string }, {}, UpdateProposalDto>,
    res: Response
  ) => {
    const { proposalId } = req.params;
    const freelancerId = req.user!.userId;

    const proposal = await this.proposalService.updateProposal(proposalId, freelancerId, req.body);

    res.json({
      success: true,
      data: proposal,
      message: 'Candidature mise à jour avec succès',
    });
  };

  // ===== WITHDRAW PROPOSAL (FREELANCER) =====
  withdrawProposal = async (req: Request<{ proposalId: string }>, res: Response) => {
    const { proposalId } = req.params;
    const freelancerId = req.user!.userId;

    const proposal = await this.proposalService.withdrawProposal(proposalId, freelancerId);

    res.json({
      success: true,
      data: proposal,
      message: 'Candidature retirée avec succès',
    });
  };

  // ===== GET MY PROPOSALS (FREELANCER) =====
  getMyProposals = async (req: Request<{}, {}, {}, GetProposalsDto>, res: Response) => {
    const freelancerId = req.user!.userId;
    const result = await this.proposalService.getMyProposals(freelancerId, req.query);

    res.json({
      success: true,
      data: result.proposals,
      pagination: result.pagination,
    });
  };

  // ===== GET PROPOSALS FOR MISSION (CLIENT) =====
  getProposalsForMission = async (
    req: Request<{ missionId: string }, {}, {}, GetProposalsDto>,
    res: Response
  ) => {
    const { missionId } = req.params;
    const clientId = req.user!.userId;

    const result = await this.proposalService.getProposalsForMission(missionId, clientId, req.query);

    res.json({
      success: true,
      data: result.proposals,
      pagination: result.pagination,
    });
  };

  // ===== RESPOND TO PROPOSAL (CLIENT) =====
  respondToProposal = async (
    req: Request<{ proposalId: string }, {}, RespondToProposalDto>,
    res: Response
  ) => {
    const { proposalId } = req.params;
    const clientId = req.user!.userId;

    const result = await this.proposalService.respondToProposal(proposalId, clientId, req.body);

    const message = req.body.action === 'ACCEPT'
      ? 'Candidature acceptée et contrat créé'
      : 'Candidature rejetée';

    res.json({
      success: true,
      data: result,
      message,
    });
  };

  // ===== GET PROPOSAL BY ID =====
  getProposalById = async (req: Request<{ proposalId: string }>, res: Response) => {
    const { proposalId } = req.params;
    const userId = req.user!.userId;

    const proposal = await this.proposalService.getProposalById(proposalId, userId);

    res.json({
      success: true,
      data: proposal,
    });
  };
}