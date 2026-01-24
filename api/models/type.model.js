import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Type extends Model {}

Type.init({
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: false
    }
}, {
    sequelize,
    tableName: "type",
    underscored: true
});
