import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM categorie 
        ORDER BY id`);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur GET /api/categories :", error);
        res.status(500).json({erreur : "Erreur de chargement des catégories"});
    }
});

export default router