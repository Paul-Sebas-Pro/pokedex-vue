import { Pokemon, Team, Type, sequelize } from "../models/index.js";
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedTables() {
    try {
        console.log("⏳ Insertion des données dans les tables...");

        // Charger les données depuis le fichier JSON
        const dataPath = join(__dirname, 'pokedex-dataset.json');
        const jsonData = await readFile(dataPath, 'utf-8');
        const data = JSON.parse(jsonData);

        // 1. Insertion des Types
        console.log("📝 Insertion des types...");
        const typesData = await Type.bulkCreate(data.types);
        console.log(`✅ ${typesData.length} types insérés`);

        // 2. Insertion des Pokémons (sans les types pour l'instant)
        console.log("📝 Insertion des pokémons...");
        const pokemonsToInsert = data.pokemons.map(({ types, ...pokemon }) => pokemon);
        const pokemonsData = await Pokemon.bulkCreate(pokemonsToInsert);
        console.log(`✅ ${pokemonsData.length} pokémons insérés`);

        // 3. Association des Types aux Pokémons
        console.log("📝 Association des types aux pokémons...");
        for (let i = 0; i < data.pokemons.length; i++) {
            const pokemon = pokemonsData[i];
            const typeIds = data.pokemons[i].types;
            await pokemon.setTypes(typeIds);
        }
        console.log(`✅ Associations types-pokémons créées`);

        // 4. Insertion des Teams
        console.log("📝 Insertion des équipes...");
        for (const teamData of data.teams) {
            const { pokemons, ...teamInfo } = teamData;
            const team = await Team.create(teamInfo);
            await team.setPokemons(pokemons);
        }
        console.log(`✅ ${data.teams.length} équipes insérées avec leurs pokémons`);

        console.log("🎉 Toutes les données ont été insérées avec succès !");

    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des données :", error);
        throw error;
    } finally {
        await sequelize.close();
        console.log("🔌 Connexion à la base de données fermée");
    }
}

// Exécution du script
seedTables();
