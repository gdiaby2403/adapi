import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM depot
        ORDER BY id`);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur GET /api/depots :", error);
        res.status(500).json({erreur : "Erreur de chargement des depots"});
    }
});

export default router