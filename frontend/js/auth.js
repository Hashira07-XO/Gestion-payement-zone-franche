import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorBox = document.getElementById('error-box');
    const errorMessage = document.getElementById('error-message');
    const btnSubmit = document.getElementById('btn-submit');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. On masque l'erreur à chaque tentative
            errorBox.classList.add('hidden');

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // 2. Mode chargement (Garde le style épuré)
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fas fa-circle-notch animate-spin mr-2"></i> Vérification...`;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.innerText = data.error || "Accès refusé. Vérifiez vos accès.";
                    errorBox.classList.remove('hidden');
                }

            } catch (error) {
                console.error("Erreur Connexion Front :", error);
                errorMessage.innerText = "Le serveur est injoignable. Lance ton Backend Node.js.";
                errorBox.classList.remove('hidden');
            } finally {
                // 3. Remise à l'état initial : Correspond exactement au code HTML
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<span>Valider les accès</span> <i class="fas fa-chevron-right text-[10px]"></i>`;
            }
        });
    }

});

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.reset();
})