import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { schemas } from "../validations/schemas.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = Router();

// Route pour l'inscription d'un utilisateur
router.post("/auth/signup", validate(schemas.userSignUp), authController.signUp);
// Route pour la connexion d'un utilisateur
router.post("/auth/login", authController.signIn);

export { router as authRouter };