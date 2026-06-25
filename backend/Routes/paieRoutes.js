import express from 'express';
import { genererFichePaieMensuelle } from '../Controllers/PaieController.js';

const router = express.Router();

router.get('/calcul/:id_emp/:mois', genererFichePaieMensuelle);

// CORRECTION : On utilise l'export natif ES Modules pour aller avec les "import" du haut
export default router;