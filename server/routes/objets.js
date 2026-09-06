import express from "express";
import {pool} from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT o.id, o.libelle AS objet ,c.libelle AS categorie
            FROM objet o
            JOIN categorie c ON o.categorie_id = c.id
            WHERE o.statut = COALESCE($1::statut_objet, o.statut)
            AND  o.categorie_id = COALESCE($2::integer, o.categorie_id)
            ORDER BY o.id;`,
            [req.query.statut || null , req.query.categorie_id || null]);
    res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur GET /api/objets :", error);
        res.status(500).json({erreur : "Erreur de chargement de la liste d'objets"});
    }
});


router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const { rows } = await pool.query(`
            SELECT o.id,  p.nom, o.categorie_id,
                    o.depot_id, d.personne_id
            FROM objet o
            JOIN depot d ON o.depot_id = d.id
            JOIN personne p ON d.personne_id = p.id
            WHERE o.id = $1`, [id]);

        if (rows.length === 0) {
            return res.status(404).json({erreur : "objet introuvable"});
        }
        res.json(rows[0]);       
    } catch (error) {
        console.error("Erreur GET /api/objets/:id :", error);
        res.status(500).json({erreur : "Erreur de chargement de l'objet"});
    }

});

export default router