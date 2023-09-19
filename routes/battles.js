"use strict";

/** Routes for battle */

const express = require('express');
const Battle = require('../models/battle');

const router = express.Router();


/** GET / 
 * 
 * Get random pokemon for battle
 * 
*/

router.get("/", async function (req, res, next) {
    try {
        const response = await Battle.getRandPoke();
        return res.json({ response });

    } catch (error) {
        return next(error);
    }
})


module.exports = router;