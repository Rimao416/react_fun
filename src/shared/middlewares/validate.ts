import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@shared/utils/errors';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sélectionner la source de données à valider
      const dataToValidate = source === 'body' ? req.body : 
                            source === 'query' ? req.query : 
                            req.params;
      
      // Valider et transformer les données
      const validated = await schema.parseAsync(dataToValidate);
      
      // Remplacer les données par les données validées et transformées
      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        req.query = validated as any;
      } else {
        req.params = validated as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError('Validation échouée', 400, errors);
      }
      next(error);
    }
  };
};