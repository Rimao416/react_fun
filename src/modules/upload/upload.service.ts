import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@config/env';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { prisma } from '@config/database';

export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = env.AWS_S3_BUCKET;
  }

  /**
   * Upload avatar avec redimensionnement
   */
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new Error('Aucun fichier reçu');

    // Générer nom unique
    const filename = `avatars/${userId}/${randomBytes(16).toString('hex')}.jpg`;

    // Redimensionner et optimiser l'image
    const processedImage = await sharp(file.buffer)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    // Upload vers S3
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: processedImage,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      })
    );

    // URL publique
    const avatarUrl = `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${filename}`;

    // ✅ Mettre à jour le profil utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return {
      url: avatarUrl,
      filename,
    };
  }

  /**
   * Supprimer ancien avatar
   */
  async deleteAvatar(filename: string) {
    if (!filename) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      })
    );
  }

  /**
   * Upload document (ex: vérification d'identité)
   */
  async uploadDocument(userId: string, file: Express.Multer.File, type: string) {
    if (!file) throw new Error('Aucun fichier reçu');

    const extension = file.mimetype.split('/')[1] || 'pdf';
    const filename = `documents/${userId}/${type}-${Date.now()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private', // ✅ fichiers privés
      })
    );

    return {
      url: `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${filename}`,
      filename,
      type,
    };
  }
}
