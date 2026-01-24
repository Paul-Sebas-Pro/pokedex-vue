import { Team, Pokemon } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

export const pokemonController = {
    /**
     * Consulter la liste des Pokémons
     * GET /pokemons
     * @param {*} req 
     * @param {*} res 
     */
    async getAllPokemons(req, res) {
        try {
            // Récupérer tous les Pokémons triés par nom depuis la base de données
            const pokemons = await Pokemon.findAll({ order: [["name", "ASC"]] });

            // Envoyer la liste des Pokémons en réponse
            res.json(pokemons);
        
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la récupération des Pokémons" });
        }
    },

    /**
     * Consulter le détail d'un Pokémon par son ID
     * GET /pokemons/:id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getOnePokemon(req, res) {
        try {
            // Récupérer l'ID du Pokémon depuis les paramètres de la requete
            const pokemonId = req.params.id;

            // Trouver le Pokémon par son ID en incluant ses types
            const pokemon = await Pokemon.findByPk(pokemonId, {
                include: "types" // Inclure les types associés au Pokémon
            });

            // Si le Pokémon n'existe pas, renvoyer une erreur 404
            if (!pokemon) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Pokémon non trouvé" });
            }

            // Envoyer le détail du Pokémon en réponse
            res.json(pokemon);
        
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la récupération du Pokémon" });
        }
    },

};