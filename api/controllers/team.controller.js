import { Team, Pokemon } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

export const teamController = {
    /**
     * Voir toutes les équipes avec leurs Pokémons associés
     * GET /teams
     * @param {*} req 
     * @param {*} res 
     */
    async getAllTeams(req, res) {
        try {
            const teams = await Team.findAll({ 
                include: "pokemons" // Inclure les Pokémons associés à chaque équipe
            });

            res.json(teams);
        
        } catch (error) {
            res.status
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Une erreur est survenue lors de la récupération des équipes" });
        }
    },

    /**
     * Consulter une équipe par son ID avec ses Pokémons et leurs types
     * GET /teams/:id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getOneTeam(req, res) {
        try {
            // On récupere l'id depuis les paramètres de la requete
            const teamId = req.params.id;

            const team = await Team.findByPk(teamId, {
                include: [
                    {
                        model: Pokemon,     // Inclure les Pokémons associés
                        as: "pokemons",     // Alias défini dans l'association
                        include: "types"    // Inclure les types de chaque Pokémon
                    }
                ]
            });

            // Si l'équipe n'existe pas, on renvoie une erreur 404
            if (!team) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Equipe non trouvée" });
            }

            // On renvoie l'équipe avec ses Pokémons et leurs types
            res.json(team);
        
        } catch (error) {
            res.status
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Une erreur est survenue lors de la récupération de l'équipe" });
        }
    },

    /**
     * Créer une nouvelle équipe
     * POST /teams
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createTeam(req, res) {
        try {
            // On récupere les données de l'équipe depuis le corps de la requete
            const { name, description } = req.body;

            // DROIT UTILISATEUR
            //On récupère l'ID de l'utilisateur à partir de la requête (ajouté par le middleware d'authentification)
            const creatorId = req.userId;

            // Si le name est manquant, renvoyer une erreur 400
            if (!name) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Le nom de l'équipe est obligatoire" });
            }

            // Création de la nouvelle équipe dans la base de données
            // Ajout de l'ID de l'utilisateur connecté comme créateur de l'équipe
            const newTeam = await Team.create({ 
                name, 
                description,
                user_id: creatorId  // Associer l'équipe à l'utilisateur créateur
            });

            // On renvoie la nouvelle équipe créée avec un statut 201 (Created)
            res.status(StatusCodes.CREATED).json(newTeam);
        
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la création de l'équipe" });
        }
    },

    /**
     * Modifier une équipe existante
     * PATCH /teams/:id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async updateTeam(req, res) {
        try {
            // On récupere l'id depuis les paramètres de la requete
            const teamId = req.params.id;

            // DROIT UTILISATEUR
            //On récupère l'ID de l'utilisateur à partir de la requête (ajouté par le middleware d'authentification)
            const creatorId = req.userId;

            // On vérifie si l'équipe existe
            const team = await Team.findByPk(teamId);

            // Si l'équipe n'existe pas, on renvoie une erreur 404
            if (!team) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Equipe non trouvée" });
            }

            // DROIT UTILISATEUR
            // On vérifie si l'utilisateur connecté est le créateur de l'équipe
            // Pour empécher la modification d'une équipe qui ne lui appartient pas
            if (team.user_id !== creatorId) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Vous n'êtes pas autorisé à modifier cette équipe" });
            }

            // On récupere les données à mettre à jour depuis le corps de la requete
            const { name, description } = req.body;

            // On met à jour les champs de l'équipe
            await team.update({
                name: name ?? team.name,    // Si name est fourni, on l'utilise, sinon on garde l'ancien
                description: description ?? team.description    // Si description est fourni, on l'utilise, sinon on garde l'ancien
            });

            // On renvoie l'équipe mise à jour
            res.json(team);
        
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la mise à jour de l'équipe" });
        }
    },

    /**
     * Ajouter un Pokémon à une équipe
     * POST /teams/:id/pokemons
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async addPokemonToTeam(req, res) {
        try {
            // On recupere l'id de l'équipe et du Pokémon depuis les paramètres de la requete
            const teamId = req.params.id;
            const pokemonId = req.body.pokemonId;

            // DROIT UTILISATEUR
            //On récupère l'ID de l'utilisateur à partir de la requête (ajouté par le middleware d'authentification)
            const creatorId = req.userId;
            
            // On verifie que l'équipe existe
            const team = await Team.findByPk(teamId);
            if (!team) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Equipe non trouvée" });
            }

            // DROIT UTILISATEUR
            // On vérifie si l'utilisateur connecté est le créateur de l'équipe
            // Pour empécher l'ajout de Pokémon à une équipe qui ne lui appartient pas
            if (team.user_id !== creatorId) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Vous n'êtes pas autorisé à modifier cette équipe" });
            }

            // On verifie que le Pokémon existe
            const pokemon = await Pokemon.findByPk(pokemonId);
            if (!pokemon) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Pokémon non trouvé" });
            }

            // On ajoute le Pokémon à l'équipe
            // On utilise la méthode générée par Sequelize (addPokemon) pour l'association Many-to-Many
            await team.addPokemon(pokemon);

            // On renvoie l'équipe mise à jour pour confirmation
            const updatedTeam = await Team.findByPk(teamId, { include: "pokemons" });
            res.status(StatusCodes.CREATED).json(updatedTeam);

        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de l'ajout du Pokémon à l'équipe" });
        }
    },

    /**
     * Retirer un Pokémon d'une équipe
     * DELETE /teams/:teamId/pokemons/:pokemonId
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async removePokemonFromTeam(req, res) {
        try {
            // On recupere l'id de l'équipe et du Pokémon depuis les paramètres de la requete
            // const teamId = req.params.teamId;
            // const pokemonId = req.params.pokemonId;
            const { teamId, pokemonId } = req.params;
            
            // DROIT UTILISATEUR
            //On récupère l'ID de l'utilisateur à partir de la requête (ajouté par le middleware d'authentification)
            const creatorId = req.userId;

            // On verifie si l'équipe existe
            const team = await Team.findByPk(teamId);
            if (!team) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Equipe non trouvée" });
            }

            // DROIT UTILISATEUR
            // On vérifie si l'utilisateur connecté est le créateur de l'équipe
            // Pour empécher la suppression de Pokémon d'une équipe qui ne lui appartient pas
            if (team.user_id !== creatorId) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Vous n'êtes pas autorisé à modifier cette équipe" });
            }

            // On verifie si le Pokémon existe
            const pokemon = await Pokemon.findByPk(pokemonId);
            if (!pokemon) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Pokémon non trouvé" });
            }

            // On retire le Pokémon de l'équipe
            // en utilisant la méthode générée par Sequelize (removePokemon) pour l'association Many-to-Many
            await team.removePokemon(pokemon);

            // On renvoie une réponse de succès
            res.json({ message: `Le Pokémon ${pokemon.name} a été retiré de l'équipe ${team.name}` });

        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la suppression du Pokémon de l'équipe" });
        }
    },

    /**
     * Supprimer une équipe par son ID
     * DELETE /teams/:id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async deleteTeam(req, res) {
        try {
            // On récupere l'id depuis les paramètres de la requete
            const teamId = req.params.id;

            // On recupère l'id de l'utilisateur à partir de la requête (ajouté par le middleware d'authentification)
            const userId = req.userId;

            // On vérifie si l'équipe existe
            const team = await Team.findByPk(teamId);
            if (!team) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "Equipe non trouvée" });
            }

            // DROIT UTILISATEUR
            // On vérifie si l'utilisateur connecté est le créateur de l'équipe
            // Pour empécher la suppression d'une équipe qui ne lui appartient pas
            if (team.user_id !== userId) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Vous n'êtes pas autorisé à supprimer cette équipe" });
            }

            // On supprime l'équipe de la base de données
            await team.destroy();

            // On renvoie une réponse de succès
            res.json({ message: `L'équipe ${team.name} a été supprimée avec succès` });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la suppression de l'équipe" });
        }
    }
};