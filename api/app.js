import "dotenv/config.js";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { teamsRouter } from "./routers/team.router.js";
import { pokemonsRouter } from "./routers/pokemon.router.js";
import { typesRouter } from "./routers/type.router.js";
import { authRouter } from "./routers/auth.router.js";

// Importation et configuration de Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpecification } from "./swagger.config.js";
import { sequelize } from "./models/sequelize.client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration express
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Documentation Swagger disponible à l'URL /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

// Route de test simple
/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API Pokédex
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bienvenue dans l'API du Pokédex !
 */
app.get("/", (req, res) => {
  res.send("Bienvenue dans l'API du Pokédex !");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "L'API fonctionne correctement.",
    database: sequelize.authenticate() ? "Connectée" : "Non connectée"
  });
});

/* === LES ROUTES === */
app.use("/api", teamsRouter);
app.use("/api", pokemonsRouter);
app.use("/api", typesRouter);
app.use("/api", authRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
