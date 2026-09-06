statut 201 pour post : donnée crée pas 200
statut 400 : si valeur d'enum inexistant, pas une erreur serveur (500)
statut 404 : si id inexistant
filtre optionnel COALESCE
pas de concatenation 
.env non versionné 

au moins 1 cas d'erreur : 404 id inexistant 
pour categorie

pourquoi PATCH et pas DELETE : car dans 

explication détallée 

requête avec filtre optionnel : 

router.get("/", async (requeteHttp, reponseHttp) => {
  try {
    
    // Cette valeur vient de l'URL :
    // /api/objets?statut=en_vente
    const statutDemande = requeteHttp.query.statut || null;

    // Texte SQL envoyé à PostgreSQL
    const requeteSql = `
      SELECT o.id, o.libelle, o.statut, c.libelle AS categorie
      FROM objet o
      JOIN categorie c ON c.id = o.categorie_id
      WHERE o.statut = COALESCE($1::statut_objet, o.statut)
      ORDER BY o.id
    `;

    // Valeur utilisée par $1 dans la requête SQL
    const valeursSql = [statutDemande];

    // PostgreSQL exécute la requête et retourne un résultat
    const resultatSql = await pool.query(requeteSql, valeursSql);

    // On récupère les lignes reçues de PostgreSQL
    const objets = resultatSql.rows;

    // Réponse HTTP envoyée à Postman
    reponseHttp.status(200).json(objets);
  } catch (error) {
    console.error("Erreur GET /api/objets :", error);

    reponseHttp.status(500).json({
      erreur: "Erreur de chargement de la liste d'objets"
    });
  }
});