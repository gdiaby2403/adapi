import express from "express";
import objetsRouter from "./routes/objets.js";
import categoriesRouter from "./routes/categories.js"
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with {type : "json"};

const app = express();

/*Swagger*/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/*Middleware pour parser le JSON :  Permet de convertir le JSON de la database en JS sur le client et inversement */
app.use(express.json()); 

//Route racine
app.get("/", (req,res) => {
    res.json({nom:"API La Remise"})
});

//Routes API
app.use("/api/objets", objetsRouter);

app.use("/api/categories", categoriesRouter);

//Port de connexion
app.listen(3000, () => {
    console.log("Serveur sur http://localhost:3000")
});



