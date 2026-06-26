// 1. Importation de mysql2 avec le support des Promises (indispensable pour async/await)
import mysql from 'mysql2/promise'
import 'dotenv/config';

// 2. Structure Singleton pour garantir qu'on ne crée QU'UN SEUL Pool de connexions
class Database {
    constructor() {
        // Si l'instance n'existe pas encore, on la crée
        if (!Database.instance) {
            console.log('📦 Création unique du Pool de connexions...');
            
            // Configuration du Pool avec les variables issues du .env
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT || 3306,
                connectionLimit: 10, // Réserve de 10 guichets ouverts en simultané
                queueLimit: 0        // File d'attente infinie si gros trafic à l'usine
            });
            console.log('tonga eto');

            Database.instance = this;
        }

        // Si elle existe déjà, on renvoie directement l'instance existante
        return Database.instance;
    }

    // Méthode pour donner accès au Pool
    getConnection() {
        return this.pool;
    }
}

// 3. On instancie la classe une bonne fois pour toutes
const instance = new Database();

// 4. MODULE 1 : EXPORTATION
// On exporte directement le Pool pour pouvoir faire "db.query()" n'importe où
export default instance.getConnection();