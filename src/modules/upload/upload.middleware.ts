
import multer from 'multer';
import { AppError } from '@shared/utils/errors';

// Configuration Multer (mémoire)
const storage = multer.memoryStorage();

// Filtres de fichiers
const imageFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Seules les images sont autorisées', 400), false);
  }
};

const documentFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Format de fichier non autorisé', 400), false);
  }
};

// Middleware upload avatar
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).single('avatar');

// Middleware upload document
export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
}).single('document');