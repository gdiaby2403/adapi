import express from "express";
import {pool} from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM objets ORDER BY id`);
    res.status(200).json(rows);
});


router.get("/:id", async (req, res) => {
    const { rows } = await pool.query(`SELECT id FROM objet ORDER BY id`);
    res.json(rows);
});

export default router