import { DataTypes, Model } from "sequelize";
import { sequelize}  from "./sequelize.client.js";

export class Team extends Model {}

Team.init({
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "team",
    underscored: true
});
