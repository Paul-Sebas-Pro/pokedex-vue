import { User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authController = {
    /**
     * Inscription d'un nouvel utilisateur
     * POST /auth/signup
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async signUp(req, res) {
        try {
            // Récupérer les données de l'utilisateur depuis le corps de la requete
            const { pseudo, email, password, passwordConfirm } = req.body;

            // Verifier la presence de tous les champs
            if (!pseudo || !email || !password || !passwordConfirm) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Tous les champs sont requis" });
            }
            
            // Vérifier que le mot de passe et la confirmation sont identiques
            if (password !== passwordConfirm) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Le mot de passe et la confirmation ne correspondent pas" });
            }

            // Vérifier que l'utilisateur n'existe pas déjà avec le même email
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res
                    .status(StatusCodes.CONFLICT)
                    .json({ error: "Cet email est déjà utilisé" });
            }

            // Vérifier que le mot de passe ne sera pas tronqué (limite de 72 bytes)
            if (bcrypt.truncates(password)) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Le mot de passe est trop long (maximum 72 bytes)" });
            }

            // Hasher le mot de passe avec bcrypt avant de le stocker
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Créer le nouvel utilisateur dans la base de données
            const newUser = await User.create({
                pseudo,
                email,
                password: hashedPassword
            });

            // Renvoyer une réponse de succès avec les informations de l'utilisateur (sans le mot de passe)
            res.status(StatusCodes.CREATED).json({
                id: newUser.id,
                pseudo: newUser.pseudo,
                email: newUser.email
            });
        
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de l'inscription" });
        }
    },

    /**
     * Connexion d'un utilisateur
     * POST /auth/login
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async signIn(req, res) {
        try {
            // Récupérer les données de connexion depuis le corps de la requete
            const { email, password } = req.body;

            // Verifier la presence de tous les champs
            if (!email || !password) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Tous les champs sont requis" });
            }

            // Trouver l'utilisateur par son email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ error: "Email ou mot de passe incorrect" });
            }

            // Vérifier le mot de passe avec bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ error: "Email ou mot de passe incorrect" });
            }

            // Générer un token JWT pour l'utilisateur
            // On stocke dans le token l'ID et l'email de l'utilisateur
            // Usage de JWT : 
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }    // Le token expire en 24 heures
            );

            // Renvoyer une réponse de succès avec le token et les informations de l'utilisateur
            res.json({ 
                message: "Connexion réussie",
                token,
                user: {
                    id: user.id,
                    pseudo: user.pseudo,
                    email: user.email
                }
            });
        
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Une erreur est survenue lors de la connexion" });
        }
    }
};