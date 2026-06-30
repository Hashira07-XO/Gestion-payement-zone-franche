import express from 'express';
import cors from 'cors';       
import dotenv from 'dotenv';         
import db from './config/database.js'; 
import employeRoutes from './Routes/employeRoutes.js';
import pointageRoutes from './routes/pointageRoutes.js'; 
import categorieRoutes from './Routes/categorieRoutes.js';
import paieRoutes from './Routes/PaieRoutes.js';
import authRoutes from './Routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Liaison des routes
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/paie', paieRoutes);
app.use('/api/auth', authRoutes);

// Rendre le dossier des images accessible publiquement
app.use('/uploads', express.static('uploads'));

// Route de base
app.get('/', (req, res) => {
    res.json({ 
        status: "success", 
        message: "API de Gestion Zone Franche opérationnelle ! Tu as dompté les bases." 
    });
});

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