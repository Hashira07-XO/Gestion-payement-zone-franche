// routes/employeRoutes.js
import express from 'express';
import  employeController from '../Controllers/employeController.js';
const router = express.Router();


// Définir la route POST pour l'inscription d'un employé
router.post('/register', employeController.creerEmploye);
router.get('/', employeController.obtenirTousLesEmployes);
router.put('/archive/:matricule', employeController.supprimerEmploye);
router.get('/:matricule', employeController.obtenirUnEmploye);
router.put('/:id_emp', employeController.modifierEmployer);

export default router;