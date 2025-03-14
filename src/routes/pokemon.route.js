import express from "express";
import { getPokemonByID, getListePokemon, addPokemon, alterPokemon, deletePokemon, addUser, getKey } from "../controllers/pokemon.controller.js";
import authentification from "../middlewares/authentification.middleware.js";

const router = express.Router();

router.put('/cle', getKey)
router.get('/liste', authentification, getListePokemon);
router.get('/:id',authentification, getPokemonByID);
router.post('/', authentification, addPokemon);
router.post('/users', addUser);
router.put('/:id', authentification, alterPokemon);
router.delete('/:id', authentification, deletePokemon);

export default router;