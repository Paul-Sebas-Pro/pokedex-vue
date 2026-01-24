import { Pokemon } from "./pokemon.model.js";
import { Team } from "./team.model.js";
import { Type } from "./type.model.js";
import { User } from "./user.model.js";
import { sequelize } from "./sequelize.client.js";

// DECLARATION DES ASSOCIATION ENTRE LES TABLES DE LA BASE DE DONNEES

/* === Association entre Pokemon et Type (plusieurs à plusieurs) === */
// Un Pokémon peut avoir plusieurs types
Pokemon.belongsToMany(Type, {
    through: "pokemon_type",
    as: "types",
    foreignKey: "pokemon_id",
    otherKey: "type_id"
});
// Un type peut appartenir à plusieurs Pokémons
Type.belongsToMany(Pokemon, {
    through: "pokemon_type",
    as: "pokemons",
    foreignKey: "type_id",
    otherKey: "pokemon_id",
});

/* === Association entre Team et Pokemon (plusieurs à plusieurs) === */
// Une équipe peut avoir plusieurs Pokémons
Team.belongsToMany(Pokemon, {
    through: "team_pokemon",
    as: "pokemons",
    foreignKey: "team_id",
    otherKey: "pokemon_id"
});
// Un Pokémon peut appartenir à plusieurs équipes
Pokemon.belongsToMany(Team, {
    through: "team_pokemon",
    as: "teams",
    foreignKey: "pokemon_id",
    otherKey: "team_id",
});

/* === Association entre User et Team (un à plusieurs) === */
// Un utilisateur peut avoir plusieurs équipes
User.hasMany(Team, {
    as: "teams",
    foreignKey: "user_id"
});
// Une équipe appartient à un utilisateur
Team.belongsTo(User, {
    as: "user",
    foreignKey: "user_id"
});

// EXPORT DES MODELES ET DE LA CONNEXION SEQUELIZE
export { sequelize, Pokemon, Team, Type, User };