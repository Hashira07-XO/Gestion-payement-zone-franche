import express from 'express';
import  categorieController from '../Controllers/categorieController.js';
const router = express.Router();

router.post('/register', categorieController.creerCategorie);
router.get('/', categorieController.listerCategorie)
router.put('/modify/:id_categorie', categorieController.modifierCategorie);
router.put('/delete/:id_categorie', categorieController.supprimerCategorie);
router.put('/restore/:id_categorie', categorieController.restaurerCategorie);

export default router;

