const express = require('express');

const router = express.Router();

const pokemonController = require('../controllers/PokemonsController');

router.get("/",pokemonController.GetPokemonsListHome);
router.get("/pokemon",pokemonController.GetPokemonsList);
router.get("/create-pokemon", pokemonController.GetCreatePokemons);
router.post("/create-pokemon", pokemonController.PostCreatePokemons);
router.get("/edit-pokemon/:pokeId", pokemonController.GetEditPokemons);
router.post("/edit-pokemon", pokemonController.PostEditPokemons);
router.post("/delete-pokemon", pokemonController.PostDeletePokemons);
router.post("/confirm-delete-pokemon", pokemonController.PostConfirmDeletePokemons);
router.get("/byregion/:regionId", pokemonController.GetPokemonbyregion);
router.post("/findbyname", pokemonController.PostPokemonbyName);

module.exports = router;
