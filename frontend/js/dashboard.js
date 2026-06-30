import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. SÉCURITÉ : Vérification de la session locale
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userData);
    if (document.getElementById('admin-name')) {
        document.getElementById('admin-name').textContent = (user.username || 'ADMIN_RH').toUpperCase();
    }

    // 2. BOUTON DÉCONNEXION
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // 3. RECUPÉRATION DES POINTAGES
    try {
        const response = await fetch(`${API_URL}/pointages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Déconnexion de la matrice de données.');

        const responseData = await response.json();
        const listePointages = responseData.donnée || [];
        
        // Indicateurs KPIs dynamiques
        document.getElementById('kpi-attendance').textContent = listePointages.length;
        
        // Calcul du total des minutes de retard pour le KPI d'alertes
        const totalAlerts = listePointages.filter(log => log.retard_min > 0).length;
        document.getElementById('kpi-alerts').textContent = totalAlerts;

        document.getElementById('kpi-payroll').textContent = `-- Ar`;

        // Rendu graphique
        renderPointageTable(listePointages);

    } catch (error) {
        console.error('Erreur Système Dashboard :', error);
        document.getElementById('kpi-attendance').textContent = 'ERR';
        document.getElementById('kpi-payroll').textContent = 'OFFLINE';
        document.getElementById('kpi-alerts').textContent = 'ERR';
    }
});

/**
 * Construit la table avec une hauteur stricte par ligne (h-12 = 48px)
 */
function renderPointageTable(pointages) {
    const tbody = document.getElementById('pointage-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (pointages.length === 0) {
        tbody.innerHTML = `
            <tr class="h-12">
                <td colspan="6" class="py-8 text-center text-gray-400 uppercase tracking-widest text-[10px]">
                    // Aucun signal de pointage détecté aujourd'hui //
                </td>
            </tr>`;
        return;
    }

    pointages.forEach(log => {
        const tr = document.createElement('tr');
        // Force la hauteur à 48px par ligne pour garantir la visibilité parfaite de 6 lignes maximum
        tr.className = 'hover:bg-gray-50/80 transition bg-white h-12 overflow-hidden';

        // Logique analytique pour le badge de statut
        let badgeStatut = `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-bold rounded-sm text-[10px] uppercase">Conforme</span>`;
        if (log.retard_min > 0) {
            badgeStatut = `<span class="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 font-bold rounded-sm text-[10px] uppercase">Retard +${log.retard_min}m</span>`;
        } else if (log.heures_sup_min > 0) {
            badgeStatut = `<span class="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 font-bold rounded-sm text-[10px] uppercase">H.Sup +${log.heures_sup_min}m</span>`;
        } else if (log.heure_deb_eff == null && log.heure_fin_eff == null)
        {
            badgeStatut = `<span class="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 font-bold rounded-sm text-[10px] uppercase">Absence</span>`;
        }

        // Mapping de tes colonnes réelles : id_pointage, matricule_emp, nom_emp, prenom_emp, heure_deb_eff, heure_fin_eff, duree_travail_min
        tr.innerHTML = `
            <td class="px-6 text-gray-400 font-mono">#${String(log.id_pointage).padStart(5, '0')}</td>
            <td class="px-6 font-bold text-corporate font-mono">${log.matricule_emp}</td>
            <td class="px-6 font-sans font-semibold text-gray-900 uppercase text-[11px] tracking-wide">${log.nom_emp} <span class="capitalize font-normal text-gray-600">${log.prenom_emp}</span></td>
            <td class="px-6 font-mono text-gray-700">${log.heure_deb_eff || '--:--'} ➔ ${log.heure_fin_eff || '--:--'}</td>
            <td class="px-6 font-mono text-gray-900 font-medium">${log.duree_travail_min || 0} min</td>
            <td class="px-6 text-right">${badgeStatut}</td>
        `;
        
        tbody.appendChild(tr);
    });
}