import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
        try {
        const id = req.params.id;

        const { rows } = await pool.query(`
            SELECT d.id AS depot, p.prenom, p.nom, o.libelle AS objet_depose
            FROM depot d
            JOIN personne p ON p.id = d.personne_id
            JOIN objet o ON o.depot_id = d.id 
            WHERE d.id = $1 `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({erreur : "depot introuvable"});
        }
        res.json(rows);       
    } catch (error) {
        console.error("Erreur GET /api/depots/:id :", error);
        res.status(500).json({erreur : "Erreur lors de la récupération du depot"});
    }
});

export default router