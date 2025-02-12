import express from 'express';

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());









// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
