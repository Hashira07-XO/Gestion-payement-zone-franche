import { CalculOuvrierStrategy, CalculCadreStrategy } from './PaieStrategies.js';

class CalculPaieContext {
    constructor() {
        // On crée un dictionnaire (une Map) qui associe 
        // la valeur exacte de ta base de données (ENUM) à la bonne classe de calcul.
        this.strategies = {
            'Ouvrier': new CalculOuvrierStrategy(),
            'Cadre': new CalculCadreStrategy()
        };
    }

    /**
     * Exécute le calcul de la paie de manière dynamique
     * @param {string} typePaie - 'Ouvrier' ou 'Cadre' (issu de la colonne type_paie)
     * @param {number} tauxHoraire - Issu de la colonne taux_horaire_base
     * @param {object} bilanMensuel - Totaux des retards, absences, heures sup du mois
     */
    executerCalcul(typePaie, tauxHoraire, bilanMensuel) {
        // 1. On récupère la stratégie correspondante dans notre dictionnaire
        const strategie = this.strategies[typePaie];

        // Sécurité au cas où un type_paie bizarre arriverait de la base
        if (!strategie) {
            throw new Error(`Aucune stratégie de calcul trouvée pour le type de paie : "${typePaie}"`);
        }

        // 2. On exécute la formule de calcul de manière totalement aveugle.
        // Le Contexte ne sait pas comment l'Ouvrier ou le Cadre est calculé, il délègue juste le travail !
        return [{
            ...strategie.calculer(tauxHoraire, bilanMensuel),
            date_generation: new Date().toISOString().split('T')[0]
        }];
    }
}

// On exporte une instance unique (Singleton) pour l'utiliser partout dans l'application
export default new CalculPaieContext();