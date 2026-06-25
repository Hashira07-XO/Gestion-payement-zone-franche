import express from 'express';
import pointageController from  '../controllers/pointageController.js';
const router = express.Router();

router.post('/entree', pointageController.marquerEntree);
router.put('/sortie', pointageController.marquerSortie)

export default router;