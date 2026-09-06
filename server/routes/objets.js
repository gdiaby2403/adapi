import express from "express";
import {pool} from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // console.log("req.query:", req.query)
        // console.log("statut :", req.query.statut);
        // console.log("categorie_id :", req.query.categorie_id);

        let query = ` SELECT o.id, o.libelle AS objet ,c.libelle AS categorie
            FROM objet o
            JOIN categorie c ON o.categorie_id = c.id`;

        const values = []

        if (req.query.categorie_id && req.query.statut) {
            query = `${query} WHERE o.categorie_id = $1 AND o.statut = $2  ORDER BY o.id`;
            values.push(req.query.categorie_id, req.query.statut);    
        }

        const{ rows } = await pool.query(query,values);


        // const { rows } = await pool.query(`
        //     SELECT o.id, o.libelle AS objet ,c.libelle AS categorie
        //     FROM objet o
        //     JOIN categorie c ON o.categorie_id = c.id
        //     ORDER BY o.id;`);

        // if (req.query.categorie_id) {
        //     console.log("Filtre sur categorie_id activé :", req.query.categorie_id);
        // } else {
        //         console.log("Pas de filtre sur categorie_id");
        // }
        // if (req.query.statut) {
        //     console.log("Filtre sur statut activé :", req.query.statut);
        // } else {
        // console.log("Pas de filtre sur statut");
        // }

    res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur GET /api/objets :", error);
        res.status(500).json({erreur : "Erreur de chargement de la liste d'objets"});
    }
});


router.get("/:id", async (req, res) => {
    try {
            const { rows } = await pool.query(`
                SELECT o.id,  p.prenom, o.categorie_id,
                        o.depot_id, d.personne_id
                FROM objet o
                JOIN depot d ON o.depot_id = d.id
                JOIN personne p ON d.personne_id = p.id
                ORDER BY o.id`);
    res.json(rows);       
    } catch (error) {
        console.error("Erreur GET /api/objets :", error);
        res.status(500).json({erreur : "Erreur de chargement de l'objet"});
    }

});

export default router