document.getElementById('btn-ouvrir-form').addEventListener('click', () => {
  const conteneur = document.getElementById('conteneur-formulaire');
  conteneur.classList.toggle('hidden');
});

document.getElementById('form-employe').addEventListener('submit', function(e) {
  e.preventDefault(); // Bloque le rechargement de page

  // 1. Extraction des données saisies matchant ton format d'API
  const nouvelEmploye = {
    matricule_emp: document.getElementById('matricule_emp').value,
    nom_emp: document.getElementById('nom_emp').value.toUpperCase(),
    prenom_emp: document.getElementById('prenom_emp').value,
    cin_emp: document.getElementById('cin_emp').value,
    adresse_emp: document.getElementById('adresse_emp').value,
    tel_emp: document.getElementById('tel_emp').value,
    id_categorie: parseInt(document.getElementById('id_categorie').value),
    heure_deb_prev: document.getElementById('heure_deb_prev').value,
    heure_fin_prev: document.getElementById('heure_fin_prev').value,
    date_embauche: new Date().toISOString() // Date du jour au format ISO
  };

  // 2. Envoi de la requête POST vers ton API Rest
  fetch('http://127.0.0.1:3005/api/employes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nouvelEmploye)
  })
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors de l'insertion");
    return response.json();
  })
  .then(data => {
    alert("Employé enregistré avec succès !");
    
    // 3. Mise à jour des informations du Badge à l'écran
    document.getElementById('badge-nom').innerText = `${nouvelEmploye.nom_emp} ${nouvelEmploye.prenom_emp}`;
    document.getElementById('badge-matricule').innerText = nouvelEmploye.matricule_emp;
    
    // Nettoyage de l'ancienne zone QR Code si elle existe
    const qrcodeBox = document.getElementById('badge-qrcode');
    qrcodeBox.innerHTML = "";

    // 4. Génération dynamique du QR Code basé sur l'URL unique de l'employé
    new QRCode(qrcodeBox, {
      text: `http://127.0.0.1:3005/api/employes/${nouvelEmploye.matricule_emp}`,
      width: 90,
      height: 90,
      colorDark : "#1a365d",
      colorLight : "#ffffff"
    });

    // Affichage de la zone du badge
    document.getElementById('zone-badge').classList.remove('hidden');
    // Réinitialisation du formulaire
    document.getElementById('form-employe').reset();
  })
  .catch(error => {
    console.error("Erreur API :", error);
    alert("Impossible de créer l'employé. Vérifiez la console.");
  });
});