import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware d'authentification JWT
 * Authentifier les requêtes entrantes en vérifiant le token JWT
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const authMiddleware = (req, res, next) => {
    try {
        // Récuperer le header Authorization (format: "Bearer <token>")
        const authHeader = req.headers.authorization;

        // Si le header est absent, renvoyer une erreur 401 (Unauthorized)
        if (!authHeader) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Token manquant" });
        }

        // Extraire le token du header
        // Fonctionnement du split :
        // (Bearer es1az23456).split(" ") => ["Bearer", "es1az23456"]
        // (Bearer es1az23456).split(" ")[1] => "es1az23456"
        const token = authHeader.split(" ")[1];

        // Vérifier le token JWT avec la clé secrète
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Ajouter les informations décodées du token à la requête pour une utilisation ultérieure
        req.userId = decodedToken.userId;

        // Passer au middleware ou à la route suivante
        next();
    
    } catch (error) {
        // En cas d'erreur (token invalide, expiré, etc.), renvoyer une erreur 401
        if (error.name === "JsonWebTokenError") {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Votre session a expiré, veuillez vous reconnecter" });
        }

        // Pour les autres erreurs (token malformé, mauvaise clé, etc.)
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token invalide" });
    }
};