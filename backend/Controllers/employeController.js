import Employe from '../Model/employes.js';

const employeController = {
    creerEmploye: async (req, res) => {
        try {
            const {
                matricule_emp,
                nom_emp,
                prenom_emp,
                cin_emp,
                date_naiss_emp,
                sexe_emp,
                adresse_emp,
                tel_emp,
                data_embauche,
                statut_emp,
                poste
            } = req.body;

            if (!matricule_emp || !nom_emp) {
                return res.status(400).json({ error: "Le matricule et le nom sont obligatoires." });
            }

            const resultat = await Employe.create({
                matricule: matricule_emp,
                nom: nom_emp,
                prenom: prenom_emp,
                cin: cin_emp,
                dateNaissance: date_naiss_emp,
                sexe: sexe_emp,
                adresse: adresse_emp,
                telephone: tel_emp,
                dateEmbauche: data_embauche,
                statut: statut_emp,
                poste: poste
            });
            console.log('insertion réussi');

            return res.status(201).json({
                message: "🎉 Employé inscrit avec succès !",
                employeId: resultat.insertId
            });

        } catch (erreur) {
            console.error("Erreur dans le contrôleur :", erreur.message);
            return res.status(500).json({ 
                error: "Une erreur est survenue lors de l'inscription.",
                details: erreur.message 
            });
        }
    },
    obtenirTousLesEmployes: async (req, res) => {
        try {
            const { statut } = req.query; 
            
            const employes = await Employe.findAll(statut);
            return res.status(200).json({
                status: "success",
                resultats: employes.length,
                donnees: employes
            });
        } catch (erreur) {
            console.error("Erreur récupération :", erreur.message);
            return res.status(500).json({ error: "Impossible de récupérer les employés." });
        }
    },

    obtenirUnEmploye : async (req, res) => {
        try
        {
            const {matricule} = req.params;

            const employe = await Employe.findByMatricule(matricule);

            return res.status(200).json(
                {
                    statut : 'success',
                    donnees : employe
                }
            )
        }catch (error)
        {
            console.error('erreur de recherche:', error.message);
            return res.status(500).json({ error: "Impossible de récupérer l'employé." });
        }
    },

    modifierEmployer: async (req, res) =>
    {
        try {
            const {id_emp} = req.params;
            const data = req.body;

            const updateEmploye = await Employe.update(id_emp, data);
            if (updateEmploye.affectedRows === 0) {
                return res.status(404).json({ error: "Impossible de modifier : employé introuvable." });
            }
            return res.status(200).json({
                status: "success",
                message: "L'employé a été mis à jour avec succès !"
            });
        } catch (error) {
            console.error('erreur de modification:', error.message);
            return res.status(500).json({ error: "Impossible de modifier les informations sur l'employé." });
        }
    },

    supprimerEmploye: async (req, res) => {
        try {
            // On récupère le matricule depuis les paramètres de l'URL
            const { matricule } = req.params; 

            const resultat = await Employe.delete(matricule);

            if (resultat.affectedRows === 0) {
                return res.status(404).json({ error: "Aucun employé trouvé avec ce matricule." });
            }

            return res.status(200).json({
                status: "success",
                message: "Employé archivé avec succès (Statut: Licencié)."
            });
        } catch (erreur) {
            console.error("Erreur suppression :", erreur.message);
            return res.status(500).json({ error: "Impossible d'archiver l'employé." });
        }
    }
};



export default employeController;