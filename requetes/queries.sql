-- Active: 1787577660689@@127.0.0.1@5432@laremise@public
SELECT COUNT(*) FROM objet


/*REQUETES GET*/
SELECT id, libelle FROM categorie
/* api/categories id et libelle de catégorie */

SELECT o.id, o.libelle AS objet ,c.libelle AS categorie
FROM objet o
JOIN categorie c ON o.categorie_id = c.id
ORDER BY o.id;
/* /api/objets liste objets avec libellé et catégorie */

SELECT o.id,  p.prenom, o.categorie_id, o.depot_id, d.personne_id
FROM objet o
JOIN depot d ON o.depot_id = d.id
JOIN personne p ON d.personne_id = p.id
ORDER BY o.id
/*/api/objet/:id Un objet, sa catégorie, 
son dépôt et le nom de sa donatrice*/ 

SELECT o.id, o.libelle AS objet ,c.libelle AS categorie
FROM objet o
JOIN categorie c ON o.categorie_id = c.id
ORDER BY o.id;
/* /api/depots/:id Un dépôt, sa donatrice, 
et la liste des objets qu’il contient*/




/*REQUETES POST*/
SELECT nom, prenom, telephone, adherente
FROM personne
/* /api/personnes Crée une donatrice — nom, prenom, telephone?, adherente?*/

SELECT personne_id, date_depot, type
FROM depot;
/* /api/depots	Enregistre un dépôt — personne_id, date_depot, type	*/




/*REQUETE PATCH*/
SELECT * 
FROM objet
/*/api/objets/:id/statut	Fait évoluer le statut d’un objet — statut, prix?*/
