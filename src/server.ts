import { createApp } from './app';
import { env } from '@config/env';
import { prisma } from '@config/database';
import { connectRedis } from '@config/redis';

const startServer = async () => {
  try {
    // Connect to databases
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');
    
    await connectRedis();

    // Start server
    const app = createApp();
    const port = env.PORT;

    app.listen(port, () => {
      console.log(`🚀 User Service running on port ${port}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing server...');
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();