import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function logSection(title: string) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${title}`);
  console.log(`${'='.repeat(50)}\n`);
}

export function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

export function logInfo(message: string) {
  console.log(`ℹ️  ${message}`);
}