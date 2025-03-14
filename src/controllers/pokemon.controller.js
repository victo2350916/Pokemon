import { json } from "express";
import bcrypt, { hash } from "bcrypt";
const costFactor = 10;
import pokemonModel from "../models/pokemon.model.js";


const getPokemonByID = async (req, res) =>{
    const { id } = req.params;
    try{
        let pokemon = await pokemonModel.getPokemonByID(id);

        if (pokemon.length === 0){
            return res.status(404).json({message: `Erreur, Pokemon intouvable avec l'id ${id}`});
        } 
        res.json(pokemon);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `Echec lors de la récupération du pokemon avec l'id ${id}`})
    }
};

const getListePokemon = async (req, res) => {
    const { type } = req.query;
    const page = parseInt(req.query.page) || 1;  
    const limit = 25;
    const offset = (page - 1) * limit;

    try {
        let pokemons = await pokemonModel.getListePokemon(type, limit, offset);

        if (pokemons.length === 0) {
            return res.status(404).json({ message: `Il n'y a pas de pokémons de type ${type} ou il n'y a pas de page ${page}` });
        }
        res.json(pokemons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Échec lors de la récupération de la liste de pokémons` });
    }
};

const addPokemon = async (req, res) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = req.query;

    if (!nom || !type_primaire || !type_secondaire || !pv || !attaque || !defense){
        return res.status(400).json({ message: `Erreur, les paramètres nom, type_primaire, type_secondaire, pv, attaque, defense sont obligatoire. Valeurs reçues : ${JSON.stringify({ nom, type_primaire, type_secondaire, pv, attaque, defense})}`});
    }

    const nouveauPokemon = { nom, type_primaire, type_secondaire, pv, attaque, defense };

    try{
        await pokemonModel.addPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense);
        res.json({message: "pokemon ajoutée", pokemon: nouveauPokemon });
    } catch (error) {
        res.status(500).json({ message: `Erreur serveur: ${error.message}`});
    }
};

const alterPokemon = async (req, res) => {
    const { id } = req.params;
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = req.query;

    if (!id, !nom || !type_primaire || !type_secondaire || !pv || !attaque || !defense){
        return res.status(400).json({ message: `Erreur, les paramètres id, nom, type_primaire, type_secondaire, pv, attaque, defense sont obligatoire. Valeurs reçues : ${JSON.stringify({ id, nom, type_primaire, type_secondaire, pv, attaque, defense})}`});
    }

    const pokemonModifie = { id, nom, type_primaire, type_secondaire, pv, attaque, defense};

    try{
        await pokemonModel.alterPokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense);
        res.json({ message: "pokemon modifié", pokemon: pokemonModifie });
    } catch (error) {
        res.status(500).json({ message: `Erreur serveur: ${error.message}`});
    }
};

const deletePokemon = async (req, res) => {
    const { id } = req.params;
    try{
        await pokemonModel.deletePokemon(id);
        res.json({message: "pokemon supprimé", pokemon: id});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `Echec lors de la suppression du pokemon avec l'id ${id}`})
    }
}

const addUser = async (req, res) => {
    const {nom, courriel, mot_de_passe} = req.query;

    if (!nom || !courriel || !mot_de_passe ) {
        return res.status(400).json({ message: `Erreur, les paramètres nom, courriel, mot_de_passe sont obligatoire. Valeurs reçues : ${JSON.stringify({ nom, courriel, mot_de_passe})}`});
    }
    
    const existe = await pokemonModel.verifierCourriel(courriel);
    if (existe){
        return res.status(400).json({ message: `Erreur, l'adresse courriel ${courriel} est déjà utilisée`});
    }

    let cleApi = generateApiKey();

    const hash = await bcrypt.hash(mot_de_passe, costFactor);

    const nouvelUtilisateur = {nom, courriel, hash, cleApi}

    try {
        await pokemonModel.addUser(nom, courriel, hash, cleApi);
        res.json({message: "Utilisateur ajouté", nouvelUtilisateur: nouvelUtilisateur });
    } catch (error) {
        res.status(500).json({ message: `Erreur serveur: ${error.message}`});
        
    }
}

const getKey = async (req, res) => {
    try {
        const { courriel, mot_de_passe, nouvelle } = req.query;

        if (!courriel || !mot_de_passe) {
            return res.status(400).json({
                message: `Erreur, les paramètres courriel et mot_de_passe sont obligatoires. Valeurs reçues : ${JSON.stringify({ courriel, mot_de_passe })}`
            });
        }

        // Attente de la récupération du hash du mot de passe
        let hash = await pokemonModel.verifierMotDePasse(courriel);
        
        // Si aucun mot de passe n'est trouvé (utilisateur inexistant)
        if (!hash) {
            return res.status(400).json({ message: `Erreur, utilisateur non trouvé` });
        }

        // Vérification du mot de passe avec bcrypt
        let motDePasseValide = await bcrypt.compare(mot_de_passe, hash);

        if (!motDePasseValide) {
            return res.status(400).json({ message: `Erreur, le mot de passe n'est pas valide` });
        }

        // Si l'utilisateur veut une nouvelle clé API
        if (nouvelle == 1) {
            let key = generateApiKey();
            await pokemonModel.alterKey(key, courriel, mot_de_passe);
            return res.status(200).json({ message: "Clé API mise à jour avec succès", key });
        }
        else{
            let key = await pokemonModel.retrouverCle(courriel);
            return res.status(200).json({ message: "Clé API :", key });

        }

    } catch (error) {
        console.error("Erreur dans getKey:", error);
        return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};


function generateApiKey() {
    let apiKey = '';
    for (let i = 0; i < 6; i++) {
      apiKey += Math.floor(Math.random() * 10).toString();
    }
    return apiKey;
}



export { getPokemonByID, getListePokemon, addPokemon, alterPokemon, deletePokemon, addUser, getKey }