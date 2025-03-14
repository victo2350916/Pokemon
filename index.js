import express from 'express';
import pokemonRoutes from './src/routes/pokemon.route.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf-8'));

const swaggerOptions = {
    customCss: '.swagger-ui .topbar {display: none }',
    customSiteTitle: "Demo API"
};

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());

app.use('/api/pokemons', pokemonRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
