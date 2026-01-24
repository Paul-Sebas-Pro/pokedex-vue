import { Router } from "express";
import { teamController } from "../controllers/team.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { schemas } from "../validations/schemas.js";

const router = Router();

/* ===================================================== */
/* ===  LES ROUTES PUBLIQUES (sans authentification) === */
/* ===================================================== */
// Route pour obtenir toutes les équipes
/**
 * Route pour obtenir toutes les équipes
 * @swagger
 * /teams:
 *   get:
 *     summary: Récupérer toutes les équipes avec les Pokémons associés
 *     tags:
 *      - Teams
 *     responses:
 *       200:
 *         description: Liste des équipes
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Team'
 *                 - type: object
 *                   properties:
 *                     pokemons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pokemon'
 */
router.get("/teams", teamController.getAllTeams);
// Route pour obtenir une équipe par son ID
router.get("/teams/:id", teamController.getOneTeam);

/* ==================================================== */
/* ===  LES ROUTES PRIVEES (avec authentification)  === */
/* ==================================================== */
/**
 * Route pour créer une nouvelle équipe
 * @swagger
 * /teams:
 *   post:
 *     summary: Créer une nouvelle équipe
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Equipe 1"
 *               description:
 *                 type: string
 *                 example: "Nom de l'équipe"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Equipe créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Nom de l'équipe obligatoire
 *       409:
 *         description: Une équipe avec ce nom existe déjà pour cet utilisateur
 */
router.post("/teams", authMiddleware, validate(schemas.team), teamController.createTeam);

/**
 * Route pour mettre à jour une équipe existante
 * @swagger
 * /teams/{id}:
 *   patch:
 *     summary: Mettre à jour une équipe existante
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Team'
 *     responses:
 *       200:
 *         description: Equipe mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Team'
 *                 - type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *       403:
 *         description: Non autorisé à modifier cette équipe
 *       404:
 *         description: Equipe non trouvée
 */
router.patch("/teams/:id", authMiddleware, validate(schemas.team), teamController.updateTeam);

// Route pour supprimer une équipe
/**
 * Route pour supprimer une équipe
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Supprimer une équipe
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe à supprimer
 *     responses:
 *       200:
 *         description: Equipe supprimée avec succès
 *       403:
 *         description: Non autorisé à supprimer cette équipe
 *       404:
 *         description: Equipe non trouvée
 */
router.delete("/teams/:id", authMiddleware, teamController.deleteTeam);

/**
 * Route pour ajouter un Pokémon à une équipe
 * @swagger
 * /teams/{id}/pokemons:
 *   post:
 *     summary: Ajouter un Pokémon à une équipe
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pokemonId:
 *                 type: integer
 *                 example: 25
 *             required:
 *               - pokemonId
 *     responses:
 *       200:
 *         description: Pokémon ajouté à l'équipe avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Team'
 *                 - type: object
 *                   properties:
 *                     pokemons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pokemon'
 *       403:
 *         description: Non autorisé à modifier cette équipe
 *       404:
 *         description: Equipe ou Pokémon non trouvé
 */
router.post("/teams/:id/pokemons", authMiddleware, teamController.addPokemonToTeam);

/**
 * Route pour supprimer un Pokémon d'une équipe
 * @swagger
 * /teams/{teamId}/pokemons/{pokemonId}:
 *   delete:
 *     summary: Supprimer un Pokémon d'une équipe
 *     tags:
 *      - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *       - in: path
 *         name: pokemonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Pokémon supprimé de l'équipe avec succès
 *       404:
 *         description: Equipe ou Pokémon non trouvé
 *       403:
 *         description: Non autorisé à modifier cette équipe
 */
router.delete("/teams/:teamId/pokemons/:pokemonId", authMiddleware, teamController.removePokemonFromTeam);


export { router as teamsRouter };
