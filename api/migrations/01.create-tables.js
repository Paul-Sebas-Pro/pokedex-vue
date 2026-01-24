import { sequelize } from "../models/index.js";

async function setupDatabase() {
    try {
        console.log("⏳ Suppression des tables existantes...");
        await sequelize.drop(); 
    
        console.log("⏳ Création des tables...");
        // sync() crée les tables de liaison automatiquement grâce aux associations
        await sequelize.sync(); 

        // Afficher les tables créées
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log("✅ Structure de la base de données créée :", tables);
    
    } catch (error) {
        console.error("❌ Erreur lors de la configuration de la base de données :", error);
    }finally {
        await sequelize.close();
        console.log("🔒 Connexion à la base de données fermée.");
    }
}

// Lancer la configuration de la base de données
setupDatabase();