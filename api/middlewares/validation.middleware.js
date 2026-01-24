/* === MIDDLEWARE GENERIQUE DE VALIDATION DES DONNEES === */
import { StatusCodes } from "http-status-codes";

/**
 * Validateur de schéma de données
 * @param {object} schema 
 * @returns middleware de validation
 */
export const validate = (schema) => {
    return (req, res, next) => {
        // Valider les données de la requête (req.body) en utilisant le schéma fourni
        const { error } = schema.validate(req.body);

        // Si une erreur de validation est détectée, renvoyer une réponse d'erreur 400 (Bad Request)
        if (error) {
            const errors = error.details.map(detail => detail.message).join(", ");
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: errors });
        }

        // Si les données sont valides, passer au middleware ou à la route suivante
        next();
    }
};