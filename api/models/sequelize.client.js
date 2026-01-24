import "dotenv/config.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },
    logging: false, // Désactive les logs SQL
});

// Test de la connexion à la base de données
async function testConnexion() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès.');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
  }
}

testConnexion();

export { sequelize };
