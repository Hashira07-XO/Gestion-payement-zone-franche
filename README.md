les prérequis de ce projet :

* XAMPP : pour le développement de la base de données et pour le serveur MySQL
* Node.js : C'est le moteur qui permet d'exécuter du JavaScript directement sur  le pc hôte.
* NPM - Node Package Manager (Le Fournisseur) : C’est un immense magasin en ligne d'outils gratuits créés par d'autres développeurs. Au lieu de réinventer la roue et de coder toi-même un système de connexion à MySQL.

  * Express (Le Serveur / Le Serveur de salle) : C'est le package le plus important. Il écoute les requêtes HTTP arrivant sur ton PC. (voire information sur les requête HTTP.
  * Mysql2 (Le Pont de la Base de Données) : C'est le traducteur. Node.js parle JavaScript, et XAMPP parle SQL. mysql2 permet à ton code Node.js d'envoyer des requêtes (comme SELECT ou INSERT) à ton serveur MySQL et de récupérer les résultats sous forme d'objets JavaScript manipulables.
  * Cors (Cross-Origin Resource Sharing):Par défaut, pour des raisons de sécurité, un serveur Node.js refuse les requêtes qui viennent d'un autre appareil (comme ta tablette Expo). Cors permet d'enlever cela et autoriser un appareil de se connecter avec le serveur node.js
  * Dotenv : utiliser pour cacher des données secrètes comme mot de base la base de données en question et le port du serveur dans un fichier .env.

&#x09;

Structure du MVC :

backend-zone-franche/

├── config/             # Configuration (Connexion BDD Singleton)

├── controllers/        # Logique métier (Traitement des données)

├── models/             # Requêtes SQL de la base de données

├── routes/             # Définition des points d'accès (Endpoints API)

├── strategies/         # Ton Strategy Pattern pour le calcul des paies

├── .env                # Variables d'environnement (Mots de passe, ports)

├── package.json        # Configuration du projet Node

└── server.js           # Point d'entrée de ton application

