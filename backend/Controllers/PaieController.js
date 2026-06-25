import db from '../config/database.js'; // Ta connexion MariaDB
import calculPaieContext from '../services/CalculPaieContext.js';

export const genererFichePaieMensuelle = async (req, res) => {
    const { id_emp, mois } = req.params; // Exemple: id_emp = 7, mois = '2026-06'

    try {
        // 1. Récupérer les infos contractuelles de l'employé et sa catégorie
        const [employe] = await db.query(
            `SELECT e.id_emp, c.taux_horaire_base, c.type_paie 
             FROM employes e
             JOIN categories c ON e.id_categorie = c.id_categorie
             WHERE e.id_emp = ?`, 
            [id_emp]
        );

        if (employe.length === 0) {
            return res.status(404).json({ message: "Employé introuvable" });
        }

        const infosEmp = employe[0];

        // 2. Récupérer le bilan des pointages de l'employé pour le mois donné
        const [bilanPointage] = await db.query(
            `SELECT 
                SUM(retard_min) as total_retard_min,
                SUM(heures_sup_min) as total_heures_sup_min,
                COUNT(CASE WHEN statut = 'Absent' THEN 1 END) as total_jours_absents
             FROM pointages 
             WHERE id_emp = ? AND DATE_FORMAT(date_pointage, '%Y-%m') = ?`,
            [id_emp, mois]
        );

        // Si aucun pointage ce mois-ci, on initialise un bilan vide
        const bilan = bilanPointage[0].total_retard_min !== null ? bilanPointage[0] : {
            total_retard_min: 0,
            total_heures_sup_min: 0,
            total_jours_absents: 0
        };

        // 3. LA MAGIE DU PATTERN STRATEGY
        // On passe le type_paie ('Ouvrier' ou 'Cadre') et le contexte s'occupe du reste
        const fichePaie = calculPaieContext.executerCalcul(
            infosEmp.type_paie,
            parseFloat(infosEmp.taux_horaire_base),
            {
                total_retard_min: parseInt(bilan.total_retard_min) || 0,
                total_heures_sup_min: parseInt(bilan.total_heures_sup_min) || 0,
                total_jours_absents: parseInt(bilan.total_jours_absents) || 0
            }
        );

        // 4. On renvoie le résultat (qui pourra alimenter ton Front-End)
        return res.status(200).json({
            id_emp: id_emp,
            mois: mois,
            bilan_calcul: fichePaie[0]
        });

    } catch (error) {
        console.error("Erreur lors du calcul de la paie :", error);
        return res.status(500).json({ message: "Erreur serveur interne" });
    }
};