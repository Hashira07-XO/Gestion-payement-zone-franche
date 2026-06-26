import Auth from "../Model/auth.js";

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Tous les champs sont obligatoires." });
            }

            const auth = new Auth(username, password);

            const adminTrouve = await auth.login();

            if (adminTrouve.length === 0) {
                return res.status(401).json({
                    error: "Veuillez vérifier vos identifiants."
                });
            }

            const admin = adminTrouve[0];

            return res.status(200).json({
                status: "success",
                message: "🔒 Connexion réussie depuis la BDD !",
                user: {
                    id: admin.id_admin,
                    username: admin.username,
                    nom: admin.nom_admin,
                    role: admin.role
                }
            });

        } catch (erreur) {
            console.error("Erreur Auth BDD :", erreur.message);
            return res.status(500).json({ error: "Erreur lors de la connexion au serveur." });
        }
    },

    modifierPass: async (req, res) => {
        try {
            const { id_admin, password, new_password, confirm_new_password } = req.body;
            
            if (!id_admin || !password || !new_password || !confirm_new_password) {
                return res.status(400).json({ error: "Tous les champs sont obligatoires." });
            }

            if (new_password !== confirm_new_password) {
                return res.status(400).json({ error: "Les nouveaux mots de passe ne correspondent pas." });
            }

            const admin = await Auth.trouverParId(id_admin);
            if (!admin) {
                return res.status(404).json({ error: "Administrateur introuvable." });
            }

            if (password !== admin.password) {
                return res.status(401).json({ error: "L'ancien mot de passe est incorrect." });
            }

            await Auth.modifierLeMotDePass(id_admin, new_password);

            return res.status(200).json({ 
                status: "success",
                message: "🔄 Mot de passe mis à jour avec succès !" 
            });

        } catch (erreur) {
            console.error("Erreur Modification Pass :", erreur.message);
            return res.status(500).json({ error: "Erreur interne du serveur lors de la modification." });
        }
    }
};

export default authController;