const db = require('../config/database'); 
const { update } = require('./employes');

class Pointage {
    static async enregistrerEntree(id_emp, heure_arrivee) {
        try {
            const dateAujourdhui = new Date().toISOString().slice(0, 10);

            const queryExist = `
                SELECT c.heure_deb_prev 
                FROM employes e 
                INNER JOIN categories c ON e.id_categorie = c.id_categorie 
                WHERE e.id_emp = ? AND c.existe = 1
            `;
            const [rows_exist] = await db.query(queryExist, [id_emp]);

            if (rows_exist.length === 0) {
                throw new Error("Ce poste n'existe plus ou l'employé est introuvable. Pointage annulé.");
            }

            const { heure_deb_prev } = rows_exist[0];

            const [verif] = await db.query(
                "SELECT id_pointage FROM pointages WHERE id_emp = ? AND date_pointage = ?", 
                [id_emp, dateAujourdhui]
            );

            if (verif.length > 0) {
                throw new Error("L'employé a déjà pointé son arrivée aujourd'hui.");
            }

            const query = `
                INSERT INTO pointages (id_emp, date_pointage, heure_deb_eff, retard_min) 
                VALUES (?, ?, ?, IF(? > ?, TIME_TO_SEC(TIMEDIFF(?, ?)) / 60, 0))
            `;
            
            const [resultat] = await db.query(query, [
                id_emp, 
                dateAujourdhui, 
                heure_arrivee,
                heure_arrivee,  
                heure_deb_prev, 
                heure_arrivee,   
                heure_deb_prev   
            ]);
            
            return resultat;
        } catch (error) {
            throw error;
        }
    }

    static async enregistrerSortie(id_emp, heure_fin) {
        try {
            const dateAujourdhui = new Date().toISOString().slice(0, 10);
            
            const queryInfos = `
                SELECT p.heure_deb_eff, c.heure_deb_prev, c.heure_fin_prev 
                FROM pointages p
                INNER JOIN employes e ON p.id_emp = e.id_emp
                INNER JOIN categories c ON e.id_categorie = c.id_categorie
                WHERE p.id_emp = ? AND p.date_pointage = ? 
            `;
            const [rows] = await db.query(queryInfos, [id_emp, dateAujourdhui]);

            if (rows.length === 0) {
                throw new Error("Impossible de marquer la sortie : aucun pointage d'entrée trouvé pour aujourd'hui.");
            }

            const { heure_deb_eff, heure_deb_prev, heure_fin_prev } = rows[0];

            const queryUpdate = `
                UPDATE pointages 
                SET 
                    heure_fin_eff = ?,
                    -- Durée de travail (sécurité avance incluse)
                    duree_travail_min = TIME_TO_SEC(TIMEDIFF(?, IF(heure_deb_eff < ?, ?, heure_deb_eff))) / 60,
                    -- Heures supplémentaires : si heure_fin > heure_fin_prev, on calcule le bonus, sinon 0
                    heures_sup_min = IF(? > ?, TIME_TO_SEC(TIMEDIFF(?, ?)) / 60, 0)
                WHERE id_emp = ? AND date_pointage = ?
            `;

            const [resultat] = await db.query(queryUpdate, [
                heure_fin,        // pour heure_fin_eff
                heure_fin,        // pour le calcul de duree_travail_min
                heure_deb_prev,   // pour la condition du IF (durée)
                heure_deb_prev,   // pour la valeur si vrai (durée)
                heure_fin,        // condition du IF heures sup : est-ce que heure_fin...
                heure_fin_prev,   // ...est supérieure à heure_fin_prev ?
                heure_fin,        // pour le TIMEDIFF des heures sup (heure de fin réelle)
                heure_fin_prev,   // pour le TIMEDIFF des heures sup (heure de fin prévue)
                id_emp,           // pour le WHERE
                dateAujourdhui    // pour le WHERE
            ]);

            return resultat;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pointage;