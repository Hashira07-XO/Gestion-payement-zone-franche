// routes/employeRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import employeController from '../Controllers/employeController.js';

const router = express.Router();

// Configuration locale de Multer pour gérer les photos de profil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Le dossier 'uploads' doit exister à la racine de ton projet Node
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Génère un nom de fichier unique pour éviter les doublons
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// --- TES ROUTES (Inchangées) ---

// Définir la route POST pour l'inscription d'un employé
router.post('/register', upload.single('photo'), employeController.creerEmploye);

// Récupérer tous les employés
router.get('/', employeController.obtenirTousLesEmployes);

// Archiver (supprimer) un employé via son matricule
router.put('/archive/:matricule', employeController.supprimerEmploye);

// Obtenir un employé spécifique via son matricule
router.get('/:matricule', employeController.obtenirUnEmploye);

// Modifier les informations d'un employé via son id_emp
router.put('/modify/:id_emp', upload.single('photo'), employeController.modifierEmployer);

export default router;