import { Router } from 'express';
import { ReferenceDataService } from './reference-data-service';

const router = Router();
const refService = new ReferenceDataService();

// Catégories
router.get('/categories/local', async (req, res) => {
  const data = await refService.getLocalServiceCategories();
  res.json({ success: true, data });
});

router.get('/categories/digital', async (req, res) => {
  const data = await refService.getDigitalServiceCategories();
  res.json({ success: true, data });
});

// Langues
router.get('/languages', async (req, res) => {
  const data = await refService.getLanguages();
  res.json({ success: true, data });
});

// Pays
router.get('/countries', async (req, res) => {
  const data = await refService.getCountries();
  res.json({ success: true, data });
});

// Clear cache (admin only)
router.delete('/cache', async (req, res) => {
  const result = await refService.clearCache();
  res.json({ success: true, data: result });
});

export default router;