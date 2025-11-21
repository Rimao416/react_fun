import { prisma } from '@config/database';
import { redis } from '@config/redis';
import { AppError } from '@shared/utils/errors';
import type { UpdateUserDto, UpdateProfileDto } from './user.dto';

export class UserService {
  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        reputation: true,
      },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // Get all users (admin only, with pagination)
  async getAllUsers(page = 1, limit = 20, filters?: any) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.status) where.status = filters.status;
    if (filters?.country) where.country = filters.country;
    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          profile: true,
          reputation: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Remove passwords from results
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPasswords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update user basic info
  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        country: data.country,
        language: data.language,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        country: true,
        language: true,
        updatedAt: true,
      },
    });

    // Invalidate cache
    await redis.del(`user:${userId}`);

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, data: UpdateProfileDto) {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        bio: data.bio,
        skills: data.skills,
        hourlyRate: data.hourlyRate,
        portfolio: data.portfolio,
      },
    });

    await redis.del(`user:${userId}`);

    return profile;
  }

  // Upload avatar
  async uploadAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    });

    await redis.del(`user:${userId}`);

    return user;
  }

  // Delete user (soft delete by changing status)
  async deleteUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'INACTIVE',
        email: `deleted_${Date.now()}_${userId}@deleted.com`,
      },
    });

    // Delete all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await redis.del(`user:${userId}`);

    return { message: 'Compte supprimé avec succès' };
  }

  // Get user statistics
  async getUserStats(userId: string) {
    const [reputation, missionCount] = await Promise.all([
      prisma.reputation.findUnique({
        where: { userId },
      }),
      // This would come from mission-service in production
      Promise.resolve({ total: 0, completed: 0, inProgress: 0 }),
    ]);

    return {
      reputation,
      missions: missionCount,
    };
  }
}