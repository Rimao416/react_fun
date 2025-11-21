import { PrismaClient, PaymentStatus, TransactionType, PaymentMethod } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';

export async function seedPayments(prisma: PrismaClient, contracts: any[]) {
  const paymentsData = [];

  for (const contract of contracts) {
    // Paiement initial (escrow)
    paymentsData.push({
      missionId: contract.missionId,
      contractId: contract.id,
      fromUserId: contract.clientId,
      toUserId: contract.freelancerId,
      amount: contract.agreedPrice,
      currency: 'XOF',
      platformFee: contract.platformFee,
      netAmount: contract.freelancerEarnings,
      type: TransactionType.MISSION_PAYMENT,
      status: contract.status === 'COMPLETED' ? PaymentStatus.COMPLETED : PaymentStatus.HELD,
      paymentMethod: PaymentMethod.MOBILE_MONEY,
      paymentDetails: { provider: 'Orange Money', number: '+221771234567' },
      processedAt: contract.status === 'COMPLETED' ? new Date() : null,
      completedAt: contract.clientValidatedAt,
    });
  }

  const payments = await Promise.all(
    paymentsData.map((data) =>
      prisma.payment.create({ data })
    )
  );

  logSuccess(`${payments.length} paiements créés`);
  return payments;
}
