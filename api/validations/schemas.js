import Joi from "joi";

/* === LES SCHEMAS DE VALIDATION === */

/**
 * Objets contenant les schémas de validation pour les différentes entités de l'application
 */
export const schemas = {
    // Schéma pour l'inscription d'un utilisateur
    userSignUp: Joi.object({
        pseudo: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().max(255).required(),
        password: Joi.string().min(8).max(255).required(),
        passwordConfirm: Joi.ref("password")    // Doit être identique au champ "password"
    }).with("password", "passwordConfirm"), // Assure que si l'un est présent, l'autre l'est aussi

    // Schéma pour la création ou la mise à jour d'une équipe
    team: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).allow("", null)   // allow("", null) permet de rendre le champ optionnel
    })

};