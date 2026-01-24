import { Router } from "express";
import { typeController } from "../controllers/type.controller.js";

const router = Router();

/** 
 * Route pour obtenir tous les Types de Pokémons
 * @swagger
 * /types:
 *   get:
 *     summary: Récupérer tous les types de Pokémons
 *     tags:
 *      - Types
 *     responses:
 *       200:
 *         description: Liste des types de Pokémons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Type'
 */
router.get("/types", typeController.getAllTypes);

/** 
 * Route pour obtenir tous les Pokémons d'un type spécifique
 * @swagger
 * /types/{id}/pokemons:
 *   get:
 *     summary: Récupérer un type avec tous les Pokémons associés
 *     tags:
 *       - Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du type de Pokémon
 *     responses:
 *       200:
 *         description: Détails du type avec la listes des Pokémons associés
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Type'
 *                 - type: object
 *                   properties:
 *                     pokemons:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Pokemon'
 *                           - type: object
 *                             properties:
 *                               types:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Type'
 *       404:
 *         description: Type non trouvé
 */
router.get("/types/:id/pokemons", typeController.getPokemonsByType);

export { router as typesRouter };