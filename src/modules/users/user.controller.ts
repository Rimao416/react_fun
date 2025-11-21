import { Request, Response } from 'express';
import { UserService } from './user.service';
import type { UpdateUserDto, UpdateProfileDto } from './user.dto';

export class UserController {
  private userService = new UserService();

  getMe = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.getUserById(userId);
    res.json({ success: true, data: user });
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    res.json({ success: true, data: user });
  };

  getAllUsers = async (req: Request, res: Response) => {
    const { page, limit, ...filters } = req.query;
    const result = await this.userService.getAllUsers(
      Number(page) || 1,
      Number(limit) || 20,
      filters
    );
    res.json({ success: true, data: result });
  };

  updateUser = async (req: Request<{}, {}, UpdateUserDto>, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.updateUser(userId, req.body);
    res.json({ success: true, data: user, message: 'Profil mis à jour' });
  };

  updateProfile = async (req: Request<{}, {}, UpdateProfileDto>, res: Response) => {
    const userId = req.user!.userId;
    const profile = await this.userService.updateProfile(userId, req.body);
    res.json({ success: true, data: profile, message: 'Profil professionnel mis à jour' });
  };

  uploadAvatar = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    // Avatar URL would come from S3 upload middleware
    const avatarUrl = (req as any).file?.location;
    const user = await this.userService.uploadAvatar(userId, avatarUrl);
    res.json({ success: true, data: user, message: 'Avatar mis à jour' });
  };

  deleteUser = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.userService.deleteUser(userId);
    res.json({ success: true, data: result });
  };

  getUserStats = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const stats = await this.userService.getUserStats(userId);
    res.json({ success: true, data: stats });
  };
}
