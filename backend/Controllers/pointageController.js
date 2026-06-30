import  Pointage from '../Model/pointages.js';

const pointageController = {
    marquerEntree: async (req, res) => {
        try {
            const { id_emp, heure_arrivee } = req.body;

            if (!id_emp || !heure_arrivee) {
                return res.status(400).json({ error: "L'ID de l'employé et l'heure d'arrivée sont requis." });
            }

            await Pointage.enregistrerEntree(id_emp, heure_arrivee);

            return res.status(201).json({
                status: "success",
                message: "Arrivée enregistrée avec succès !"
            });
        } catch (erreur) {
            console.error("Erreur pointage entrée :", erreur.message);
            // On renvoie le message d'erreur spécifique si l'employé a déjà pointé
            return res.status(400).json({ error: erreur.message });
        }
    },

    marquerSortie: async (req, res) => {
        try {
            const { id_emp, heure_fin } = req.body;

            if (!id_emp || !heure_fin) {
                return res.status(400).json({ error: "L'ID de l'employé et l'heure de fin sont requis." });
            }

            await Pointage.enregistrerSortie(id_emp, heure_fin);
            

            return res.status(200).json({
                status: "success",
                message: "Sortie enregistrée avec succès !"
            });
        } catch (erreur) {
            console.error("Erreur pointage sortie :", erreur.message);
            return res.status(400).json({ error: erreur.message });
        }
    },

    pointageDuJour: async (req, res) => {
        try {
            const resultatPointage = await Pointage.pointageDuJour();

            return res.status(200).json({
                status: "Pointage du jour affiché",
                donnée : resultatPointage
            })
        } catch (error)
        {
            console.log("Erreur lors de l'extraction de l'information dans le controller");

            return res.status(400).json({
                erreur: "erreur de lecture", 
                details : error.message
            })
        }
    }

};

export default pointageController;