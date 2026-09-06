import express from "express";
import {pool} from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {

    const { nom, prenom, telephone, adherente} = req.body; 
        try {
            if(typeof nom !== "string" || nom.trim() === ""){
                return res.status(400).json({ erreur : "le champ nom est obligatoire et doit être une chaine"})
    }
            if(typeof prenom !== "string" || prenom.trim() === ""){
                return res.status(400).json({erreur : "le champ prenom est obligatoire et doit être une chaine"}) 
    }
    //telephone pas obligatoire donc si le champ n'est pas undefined il doit être un string de 10 caractères
            if(telephone !== undefined && (typeof telephone !== "string" || telephone.length !== 10)){
                return res.status(400).json({erreur : "le champ telephone doit être une chaine de 10 caractères."}) 
    }
        const { rows } = await pool.query(
            `INSERT INTO personne (nom, prenom, telephone)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [nom, prenom, telephone]
    );
        res.status(201).json(rows[0]);
        
    } catch (error) {
        console.error("Erreur POST /api/personnes :", error);
            res.status(500).json({erreur : "Erreur lors de la création de personne "});
    }
});

export default router;