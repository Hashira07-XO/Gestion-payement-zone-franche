import db from '../config/database.js'

class Categorie {
    constructor(libelle, taux_horaire, heure_deb, heure_fin, type_paie)
    {
        this.libelle = libelle;
        this.taux_horaire = taux_horaire;
        this.heure_deb = heure_deb;
        this.heure_fin = heure_fin;
        this.type_paie = type_paie;
    }

    static async createCategorie(nouvelleCategorie)
    {
        try 
        { 
            const query = `INSERT INTO categories (libelle_cat, taux_horaire_base,
            heure_deb_prev, heure_fin_prev, type_paie) VALUES (?, ?, ?, ?, ?)`  ;

            const values = [
                nouvelleCategorie.libelle,
                nouvelleCategorie.taux_horaire,
                nouvelleCategorie.heure_deb,
                nouvelleCategorie.heure_fin,
                nouvelleCategorie.type_paie
            ];

            const [results] = await db.execute(query, values);
            return results;
        } catch (error)
        {
            throw error;
        }
    }

    static async readCategorie()
    {
        const query = "SELECT * FROM categories";
        const resultat = await db.query(query);
        return resultat;
    }

    static async updateCategorie(id_categorie, update)
    {
        try {

            const query = `UPDATE categories SET libelle_cat = ?, taux_horaire_base = ?,
            heure_deb_prev = ?, heure_fin_prev = ?, type_paie = ? WHERE id_categorie = ? `;

            const values = [
                update.libelle,
                update.taux_horaire,
                update.heure_deb,
                update.heure_fin,
                update.type_paie, 
                id_categorie          
            ];
            console.log(values);

            const [resultats] = await db.query(query, values);
            return resultats;

        } catch (erreur)
        {
            throw erreur;
        }
    }

    static async deleteCategorie(id_categorie)
    {
        const query = `UPDATE categories SET existe = 0 WHERE id_categorie = ?`;
        const [resultat] = await db.query(query, id_categorie);
        const queryEmploye = `UPDATE employes SET statut_emp = 'En congé' WHERE id_categorie = ?`;
        const resultatEmploye = await db.query(queryEmploye, id_categorie)
        return resultat;
    }

    static async restoreCategorie(id_categorie)
    {
        const query = `UPDATE categories SET existe = 1 WHERE id_categorie = ?`;
        const [resultat] = await db.query(query, id_categorie);
        const queryEmploye = `UPDATE employes SET statut_emp = 'Actif' WHERE id_categorie = ?`;
        const [resultatEmploye] = await db.query(queryEmploye, id_categorie);
        console.log(resultatEmploye);
        return resultat;
    }
}

export default Categorie;