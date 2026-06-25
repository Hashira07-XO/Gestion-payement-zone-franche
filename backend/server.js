// ========================================================
// MODULE 1 : LES IMPORTS (ES Modules)
// ========================================================
import express from 'express';
import cors from 'cors';       
import dotenv from 'dotenv';         
import db from './config/database.js'; 
import employeRoutes from './Routes/employeRoutes.js';
import pointageRoutes from './routes/pointageRoutes.js'; // Attention à la casse "routes/Routes" selon ton dossier
import categorieRoutes from './Routes/categorieRoutes.js';
import paieRoutes from './Routes/PaieRoutes.js';

// Initialisation des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); 

// Liaison des routes
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/paie', paieRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ 
        status: "success", 
        message: "API de Gestion Zone Franche opérationnelle ! Tu as dompté les bases." 
    });
});

// ========================================================
// MODULE 2 : L'ASYNCHRONISME (Le panneau STOP avec async/await)
// ========================================================
async function startServer() {
    try {
        await db.query('SELECT 1 + 1 AS test_connection');
        console.log('✅ BDD : Le Pool de connexions MySQL fonctionne parfaitement.');

        app.listen(PORT, () => {
            console.log(`🚀 Serveur : Allumé en continu sur http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Échec critique : Impossible de se connecter à MySQL.');
        console.error('Détails :', error.message);
        process.exit(1); 
    }
}

startServer();