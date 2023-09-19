"use strict";

/** Routes for home */

const express = require('express');

const Pokemon = require('../models/pokemonAPI');

const router = express.Router();


/** GET /
 * 
 * Get list of pokemon. Anyone can look it up
 * 
 */

router.get("/", async function (req, res, next) {
    try {
        let pokedex = await Pokemon.showAll();

        return res.json({ pokedex });

    } catch (error) {
        return next(error)
    }
});


/** GET /[name]
 * 
 * Get pokemon based on name. Anyone can search for it
 * 
 */

router.get("/:name", async function (req, res, next) {
    try {
        let name = req.params.name;
        let pokemon = await Pokemon.showOne(name);

        return res.json({ pokemon });

    } catch (error) {
        return next(error)
    }
});



module.exports = router;