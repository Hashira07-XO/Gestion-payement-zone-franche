// models/Employe.js
const db = require('../config/database'); // Remplace par le chemin exact vers ton pool de connexion

class Employe {
    constructor(matricule_emp, nom_emp, prenom_emp,cin_emp,date_naiss_emp,sexe_emp,adresse_emp,tel_emp, data_embauche,statut_emp, poste) {
        this.matricule = matricule_emp;
        this.nom = nom_emp;
        this.prenom = prenom_emp;
        this.cin = cin_emp;
        this.dateNaissance = date_naiss_emp;
        this.sexe = sexe_emp;
        this.adresse = adresse_emp;
        this.telephone = tel_emp;
        this.dateEmbauche = data_embauche;
        this.statut = statut_emp;
        this.poste = poste;
    }

    /**
     * Méthode statique pour insérer un employé dans la base de données
     * @param {Object} nouvelEmploye - Objet contenant les infos de l'employé
     */
    static async create(nouvelEmploye) {
        try {
            const query = `
                INSERT INTO employes (matricule_emp, nom_emp, prenom_emp, cin_emp, date_naiss_emp, sexe_emp, adresse_emp, tel_emp, date_embauche, statut_emp, id_categorie) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                nouvelEmploye.matricule,
                nouvelEmploye.nom,
                nouvelEmploye.prenom,
                nouvelEmploye.cin,
                nouvelEmploye.dateNaissance,
                nouvelEmploye.sexe,
                nouvelEmploye.adresse,
                nouvelEmploye.telephone,
                nouvelEmploye.dateEmbauche,
                nouvelEmploye.statut,
                nouvelEmploye.poste
            ];

            // Exécution de la requête via le pool - avec async/await
            const [results] = await db.query(query, values);
            return results;

        } catch (error) {
            throw error;
        }
    }

// Model/employes.js
    static async findAll(statut) {
        try {
            // On sélectionne toutes les infos de l'employé (e.*) + les infos spécifiques de sa catégorie
            let query = `
                SELECT e.*, c.libelle_cat, c.taux_horaire_base, c.heure_deb_prev, c.heure_fin_prev
                FROM employes e
                LEFT JOIN categories c ON e.id_categorie = c.id_categorie
            `;
            const params = [];

            // Notre filtre dynamique fonctionne toujours !
            if (statut) {
                query += ` WHERE e.statut_emp = ?`;
                params.push(statut);
            }

            query += " ORDER BY e.matricule_emp ASC";

            const [resultat_select] = await db.query(query, params);
            return resultat_select;
        } catch (error) {
            throw error;
        }
    }

    static async findByMatricule(matricule) {
        try {
            const query = `
                SELECT e.*, c.libelle_cat, c.taux_horaire_base, c.heure_deb_prev, c.heure_fin_prev
                FROM employes e
                LEFT JOIN categories c ON e.id_categorie = c.id_categorie
                WHERE e.matricule_emp = ?
            `;
            
            const [lignes] = await db.query(query, [matricule]);
            
            // Si le tableau est vide, on renvoie null, sinon on renvoie le premier employé [0]
            return lignes.length > 0 ? lignes[0] : null;
        } catch (error) {
            throw error;
        }
    }

static async update(id_emp, data) {
    try {
        const query = `
            UPDATE employes 
            SET nom_emp = ?, prenom_emp = ?, cin_emp = ?, date_naiss_emp = ?,
                sexe_emp = ?, adresse_emp = ?, tel_emp = ?, date_embauche = ?, 
                statut_emp = ?, id_categorie = ?
            WHERE id_emp = ?
        `;
        
        const { nom, prenom, cin, dateNaissance, sexe, adresse, tel, dateEmbauche, statut, poste } = data;
        
        // Utilisation de db.execute pour une vraie requête préparée
        const [resultat_update] = await db.query(query, [
            nom, 
            prenom, 
            cin, 
            dateNaissance, // Assurez-vous que le format est YYYY-MM-DD ou un objet Date
            sexe, 
            adresse, 
            tel, 
            dateEmbauche,  // Assurez-vous que le format est YYYY-MM-DD ou un objet Date
            statut, 
            poste, 
            id_emp
        ]);

        return resultat_update;
    } catch (error) {
        throw error;
    }
}


    static async delete(matricule) {
        try {
            const query = `UPDATE employes SET statut_emp = "Licencié" WHERE matricule_emp = ?`;
            
            const [resultat_delete] = await db.query(query, [matricule]);
            return resultat_delete;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Employe;