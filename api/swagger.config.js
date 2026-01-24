import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pokédex API",
            version: "1.0.0",
            description: "API pour gérer ses équipes de Pokémons (CRUD, authentification, validation, etc.)",
        },
        servers: [
            {
            url: "http://localhost:3000/api",
            description: "Serveur de développement",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            // Les schémas réutilisables pour les modèles de données
            schemas: {
                Pokemon: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 25,
                        },
                        name: {
                            type: "string",
                            example: "Pikachu",
                        },
                        hp: {
                            type: "integer",
                            example: 35,
                        },
                        attack: {
                            type: "integer",
                            example: 55,
                        },
                        defense: {
                            type: "integer",
                            example: 40,
                        },
                        speed: {
                            type: "integer",
                            example: 90,
                        },
                    }
                },
                Team: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1,
                        },
                        name: {
                            type: "string",
                            example: "Ultimate Team",
                        },
                        description: {
                            type: "string",
                            example: "La meilleure team du monde",
                        },
                    }
                },
                Type: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 5,
                        },
                        name: {
                            type: "string",
                            example: "Electrik",
                        },
                        color: {
                            type: "string",
                            example: "ffbb33",
                        },
                    }
                },
                User:{
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1,
                        },
                        pseudo: {
                            type: "string",
                            example: "ashketchum",
                        },
                        email: {
                            type: "string",
                            example: "ash@example.com",
                        },
                        password: {
                            type: "string",
                            example: "motdepasse123",
                        },
                    }
                },
                PokemonType: {
                    type: "object",
                    properties: {
                        pokemon_id: {
                            type: "integer",
                            example: 25,
                        },
                        type_id: {
                            type: "integer",
                            example: 5,
                        },
                    }
                },
                TeamPokemon: {
                    type: "object",
                    properties: {
                        pokemon_id: {
                            type: "integer",
                            example: 25,
                        },
                        team_id: {
                            type: "integer",
                            example: 1,
                        }
                    }
                }
            }
        },
    },

    // Chemins vers les fichiers contenant les annotations Swagger (les routers)
    apis: ["./routers/*.router.js", "./app.js"],

};

export const swaggerSpecification = swaggerJSDoc(options);