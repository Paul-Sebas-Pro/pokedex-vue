import { Type, Pokemon } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

export const typeController = {
    /**
     * Consulter la liste des Types
     * GET /types
     * @param {*} req 
     * @param {*} res 
     */
    async getAllTypes(req, res) {
        try {
            // Récupérer tous les Types triés par nom depuis la base de données
            const types = await Type.findAll({ order: [["name", "ASC"]] });

            // Envoyer la liste des Types en réponse
            res.json(types);
        
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la récupération des Types" });
        }
    },

    // Consulter le détail d'un Type par son ID
    // Lister les Pokémons associés à ce Type
    /**
     * Consulter le détail d'un Type par son ID et lister les Pokémons associés
     * en incluant les types de chaque Pokémon
     * GET /types/:id/pokemons
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getPokemonsByType(req, res) {
        try {
            // Récupérer l'ID du Type depuis les paramètres de la requete
            const typeId = req.params.id;

            // Trouver le Type par son ID
            // Inclure les Pokémons associés à ce Type
            // et pour chaque Pokémon, inclure ses Types
            const typeWithPokemons = await Type.findByPk(typeId, {
                include: {
                    model: Pokemon, // Inclure les Pokémons associés à ce Type
                    as: "pokemons",   // Alias défini dans l'association
                    include: "types"   // Inclure les types de chaque Pokémon
                }
            });

            // Si le Type n'existe pas, renvoyer une erreur 404
            if (!typeWithPokemons) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Type non trouvé" });
            }

            // Envoyer le détail du Type avec ses Pokémons en réponse
            res.json(typeWithPokemons);
        
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la récupération des Pokémons par Type" });
        }
    },
};