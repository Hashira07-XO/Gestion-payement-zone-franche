// ==========================================
// 1. STRATÉGIE POUR LES OUVRIERS
// ==========================================
class CalculOuvrierStrategy {
    /**
     * @param {number} tauxHoraire - Le taux_horaire_base de la catégorie
     * @param {object} bilanMensuel - Les totaux du mois (retards, absences, heures sup)
     */
    calculer(tauxHoraire, bilanMensuel) {
        // En zone franche, on se base souvent sur 160h normales par mois (4 semaines de 40h)
        const heuresNormalesMensuelles = 160;
        const salaireBaseMensuel = tauxHoraire * heuresNormalesMensuelles;

        // Convertir le taux horaire pour les calculs à la minute
        const tauxMinute = tauxHoraire / 60;

        // 1. Calcul des retenues pour retard (Déduction stricte à la minute)
        const retenueRetard = bilanMensuel.total_retard_min * tauxMinute;

        // 2. Calcul des retenues pour absence (1 jour d'absence = 8h de travail perdues)
        const heuresAbsentes = bilanMensuel.total_jours_absents * 8;
        const retenueAbsence = heuresAbsentes * tauxHoraire;

        // 3. Calcul des heures supplémentaires (Majorées à 25% en zone franche textile)
        const bonusHeuresSup = bilanMensuel.total_heures_sup_min * (tauxMinute * 1.25);

        // Calcul du salaire net final
        const salaireNet = salaireBaseMensuel - retenueRetard - retenueAbsence + bonusHeuresSup;

        return {
            regime_applique: "Ouvrier (Horaire)",
            salaire_base: Math.round(salaireBaseMensuel),
            deduction_retard: Math.round(retenueRetard),
            deduction_absence: Math.round(retenueAbsence),
            gain_heures_sup: Math.round(bonusHeuresSup),
            salaire_net_final: Math.round(salaireNet)
        };
    }
}

// ==========================================
// 2. STRATÉGIE POUR LES CADRES
// ==========================================
class CalculCadreStrategy {
    calculer(tauxHoraire, bilanMensuel) {
        // Un cadre est au forfait. On estime ses heures mensuelles forfaitaires à 160h également
        const salaireBaseMensuel = tauxHoraire * 160;

        // 1. Un cadre n'a PAS de retenue sur ses minutes de retard (il gère son temps)
        const retenueRetard = 0;

        // 2. Par contre, s'il s'absente des journées entières sans justification, on retient ses journées (1 j = 8h)
        const heuresAbsentes = bilanMensuel.total_jours_absents * 8;
        const retenueAbsence = heuresAbsentes * tauxHoraire;

        // 3. Un cadre n'a PAS d'heures supplémentaires payées (comprises dans son forfait)
        const bonusHeuresSup = 0;

        const salaireNet = salaireBaseMensuel - retenueAbsence;

        return {
            regime_applique: "Cadre (Forfait)",
            salaire_base: Math.round(salaireBaseMensuel),
            deduction_retard: retenueRetard,
            deduction_absence: Math.round(retenueAbsence),
            gain_heures_sup: bonusHeuresSup,
            salaire_net_final: Math.round(salaireNet)
        };
    }
}

// On exporte nos deux blocs de formules
export { CalculOuvrierStrategy, CalculCadreStrategy };