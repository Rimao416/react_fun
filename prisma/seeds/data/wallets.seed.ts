import { PrismaClient } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';

export async function seedWallets(prisma: PrismaClient, users: any[]) {
  const walletsData = users.map((user) => ({
    userId: user.id,
    availableBalance: user.role === 'FREELANCER' ? Math.random() * 100000 : 50000,
    pendingBalance: user.role === 'FREELANCER' ? Math.random() * 50000 : 0,
    savingsBalance: user.role === 'FREELANCER' ? Math.random() * 30000 : 0,
    currency: 'XOF',
    autoSaveEnabled: user.role === 'FREELANCER',
    autoSavePercent: 10,
  }));

  const wallets = await Promise.all(
    walletsData.map((data) =>
      prisma.wallet.create({ data })
    )
  );

  logSuccess(`${wallets.length} portefeuilles créés`);
  return wallets;
}