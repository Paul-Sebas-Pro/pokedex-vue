import { DataTypes, Model } from "sequelize"
import { sequelize } from "./sequelize.client.js";

export class User extends Model {}

User.init({
    pseudo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true   // Validation native de Sequelize pour vérifier le format de l'email
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, { 
    sequelize, 
    tableName: "user",
    underscored: true
});
