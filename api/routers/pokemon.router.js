import { Router } from "express";
import { pokemonController } from "../controllers/pokemon.controller.js";

const router = Router();

/**
 * Route pour obtenir tous les Pokémons
 * @swagger
 * /pokemons:
 *   get:
 *     summary: Récupérer tous les Pokémons
 *     tags:
 *       - Pokémons
 *     responses:
 *       200:
 *         description: Liste des Pokémons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 */
router.get("/pokemons", pokemonController.getAllPokemons);

// Route pour obtenir un Pokémon par son ID
/**
 * Route pour obtenir un Pokémon par son ID
 * @swagger
 * /pokemons/{id}:
 *   get: 
 *     summary: Récupérer un Pokémon par son ID
 *     tags:
 *       - Pokémons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Détails du Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Pokemon'
 *                 - type: object
 *                   properties:
 *                     types:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Type'
 *       404:
 *         description: Pokémon non trouvé
 */
router.get("/pokemons/:id", pokemonController.getOnePokemon);

export { router as pokemonsRouter };