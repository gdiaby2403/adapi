# adapi

# Adapi — API La Remise

API REST permettant d'accéder aux données de **La Remise**, une ressourcerie qui gère notamment des objets, des catégories et des dépôts.

Le projet est développé avec :

* **Node.js**
* **Express**
* **PostgreSQL**
* **Docker / Docker Compose**
* **Swagger**

---

## Prérequis

Avant de commencer, il faut avoir installé :

* [Node.js](https://nodejs.org/)
* [Docker](https://www.docker.com/) et Docker Compose

---

# Installation et lancement du projet

## 1. Récupérer le projet

Si le projet est disponible sur Git :

```bash
git clone <URL_DU_REPOSITORY>
cd adapi
```

Sinon, placez-vous directement dans le dossier du projet.

---

## 2. Installer les dépendances Node.js

À la racine du projet :

```bash
npm install
```

Cette commande installe notamment :

* `express`
* `pg`
* `dotenv`
* `cors`
* `nodemon`
* `swagger-ui-express`

---

## 3. Configurer les variables d'environnement

Le projet utilise des variables d'environnement pour se connecter à PostgreSQL.

Créez un fichier `.env` à la racine du projet.

Exemple :

```env
DB_HOST=localhost
DB_PORT=5XXX
DB_USER= XXXX
DB_PASSWORD= XXXX
DB_NAME= XXXX
PORT= 3XXX
```



### Description des variables

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `DB_HOST`     | Adresse du serveur PostgreSQL |
| `DB_PORT`     | Port PostgreSQL               |
| `DB_USER`     | Utilisateur PostgreSQL        |
| `DB_PASSWORD` | Mot de passe PostgreSQL       |
| `DB_NAME`     | Nom de la base de données     |
| `PORT`        | Port utilisé par l'API        |


---

# Importer et lancer la base de données

Le projet contient un fichier Docker Compose permettant de lancer PostgreSQL dans un conteneur.

## Lancer PostgreSQL avec Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

La base sera disponible  ici sur :

```text
localhost:5432
```

Docker crée un volume nommé `adapi-data` afin de conserver les données même après l'arrêt du conteneur.

---

## Initialisation de la base

Le fichier `docker-compose.yml` utilise le fichier :

```text
adapi.sql
```

pour initialiser la base de données PostgreSQL.

Le projet contient également :

```text
db/migration_up.sql
db/migration_down.sql
db/seed.sql
```

Ces fichiers permettent respectivement de :

* créer la structure de la base ;
* supprimer la structure ;
* ajouter un jeu de données.

### Réinitialiser complètement la base

Pour supprimer le conteneur et les données :

```bash
docker compose down -v
```

Puis relancer :

```bash
docker compose up -d
```

Cela recrée le volume et recharge le script d'initialisation.

---

# Lancer l'API

Une fois les dépendances installées et PostgreSQL lancé :

```bash
npm run dev
```

Le serveur démarre sur :

```text
http://localhost:3000
```

Un message similaire apparaît dans le terminal :

```text
Serveur sur http://localhost:3000
```

---

# Documentation Swagger

Une documentation Swagger est disponible à l'adresse :

```text
http://localhost:3000/api-docs
```

Elle permet de consulter les routes documentées et de tester certaines requêtes directement depuis le navigateur.

---

# Les routes de l'API

## Route d'accueil

### `GET /`

Retourne une information simple sur l'API.

### Réponse

```json
{
  "nom": "API La Remise"
}
```

---

# Objets

## `GET /api/objets`

Retourne la liste des objets.

Chaque objet retourné contient :

* son identifiant ;
* son libellé ;
* sa catégorie.

### Exemple

```http
GET http://localhost:3000/api/objets
```

### Réponse

```json
[
  {
    "id": 79,
    "objet": "Service à thé",
    "categorie": "Vaisselle"
  },
  {
    "id": 78,
    "objet": "Écharpe tricot",
    "categorie": "Textile"
  }
]
```

Les résultats sont triés par identifiant décroissant.

---

## Filtrer les objets par statut

La route accepte le paramètre de requête :

```text
statut
```

Exemple :

```http
GET /api/objets?statut=en_rayon
```

Les statuts possibles correspondent aux valeurs définies dans la base :

* `arrive`
* `en_reparation`
* `en_rayon`
* `vendu`
* `recycle`

---

## Filtrer les objets par catégorie

La route accepte également :

```text
categorie_id
```

Exemple :

```http
GET /api/objets?categorie_id=1
```

---

## Combiner les filtres

Il est possible de combiner les deux paramètres :

```http
GET /api/objets?statut=en_rayon&categorie_id=1
```

---

## `GET /api/objets/:id`

Retourne les informations d'un objet précis à partir de son identifiant.

### Exemple

```http
GET http://localhost:3000/api/objets/1
```

### Réponse possible

```json
{
  "id": 1,
  "nom": "Bernard",
  "categorie_id": 7,
  "depot_id": 1,
  "personne_id": 1
}
```

### Si l'objet n'existe pas

Code HTTP :

```text
404
```

Réponse :

```json
{
  "erreur": "objet introuvable"
}
```

---

# Catégories

## `GET /api/categories`

Retourne toutes les catégories présentes dans la base.

Les catégories sont triées par identifiant croissant.

### Exemple

```http
GET http://localhost:3000/api/categories
```

### Réponse possible

```json
[
  {
    "id": 1,
    "libelle": "Mobilier"
  },
  {
    "id": 2,
    "libelle": "Électroménager"
  }
]
```

---

# Dépôts

## `GET /api/depots/:id`

Retourne les informations liées à un dépôt.

La requête récupère notamment :

* l'identifiant du dépôt ;
* le prénom de la personne ayant effectué le dépôt ;
* son nom ;
* les objets déposés.

### Exemple

```http
GET http://localhost:3000/api/depots/1
```

### Réponse possible

```json
[
  {
    "depot": 1,
    "prenom": "Malika",
    "nom": "Bernard",
    "objet_depose": "Jeu de tournevis"
  }
]
```

### Si le dépôt n'existe pas

Code HTTP :

```text
404
```

Réponse :

```json
{
  "erreur": "depot introuvable"
}
```

---

# Récapitulatif des routes

| Méthode | Route                          | Description                          |
| ------- | ------------------------------ | ------------------------------------ |
| `GET`   | `/`                            | Informations sur l'API               |
| `GET`   | `/api/objets`                  | Liste les objets                     |
| `GET`   | `/api/objets?statut=...`       | Filtre les objets par statut         |
| `GET`   | `/api/objets?categorie_id=...` | Filtre les objets par catégorie      |
| `GET`   | `/api/objets/:id`              | Retourne un objet précis             |
| `GET`   | `/api/categories`              | Liste les catégories                 |
| `GET`   | `/api/depots/:id`              | Retourne les informations d'un dépôt |
| `GET`   | `/api-docs`                    | Documentation Swagger                |

---

# Comment tester l'API ?

## Avec le navigateur

Les routes `GET` peuvent être testées directement dans le navigateur.

Par exemple :

http://localhost:3000/

http://localhost:3000/api/objets


http://localhost:3000/api/categories


---

## Avec Swagger

Une fois le serveur lancé, ouvrez :
http://localhost:3000/api-docs


Swagger permet de visualiser la documentation de l'API et de tester les routes disponibles.

---

## Avec Postman ou Bruno

Vous pouvez également utiliser un client HTTP comme :

* Postman ;
* Bruno ;
* Thunder Client dans Visual Studio Code.

### Exemple de requête

Méthode :


GET

URL : http://localhost:3000/api/objets
Puis cliquez sur **Send**.

---

Les routes peuvent actuellement être testées manuellement avec :

* Swagger ;
* Postman ;
* Bruno ;
* un navigateur pour les requêtes `GET`.

---

# Structure du projet

```text
adapi/
│
├── server/
│   ├── index.js
│   ├── db.js
│   └── routes/
│       ├── objets.js
│       ├── categories.js
│       └── depots.js
│
├── db/
│   ├── migration_up.sql
│   ├── migration_down.sql
│   └── seed.sql
│
├── requetes/
│   └── queries.sql
│
├── docker-compose.yml
├── swagger.json
├── package.json
├── .env
└── README.md
```


## Réinitialiser complètement la base

```bash
docker compose down -v
docker compose up -d :  Supprime les données stockées dans le volume Docker.
```


