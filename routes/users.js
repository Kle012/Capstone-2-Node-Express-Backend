"use strict";

/** Routes for users */

const express = require('express');
const jsonschema = require('jsonschema');
const { ensureCorrectUser, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');

const User = require('../models/user');
const { createToken } = require('../helper/tokens');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();


/** GET / 
 * Get list of users. Only logged-in users should be able to use this.
 * 
 * It should return:
 *  {users: [{username, first_name, last_name, email}, ...]}
 * 
 */

router.get("/", /** ensureLoggedIn */ async function (req, res, next) {
    try {
        let users = await User.findAll();
        return res.json({ users });

    } catch (error) {
        return next(error);
    }
})


/** GET / [username] 
 * 
 * Get details on a user. Only that user should be able to use this.
 * 
 * It should return:
 *  {user: {username, first_name, last_name, email}}
 * 
 * If user cannot be found, return a 404 error
 * 
*/

router.get("/:username", /** ensureLoggedIn, ensureCorrectUser */ async function (req, res, next) {
    try {
        let user = await User.get(req.params.username);
        return res.json({ user });

    } catch (error) {
        return next(error)
    }
});


/** PATCH /[username] 
 * 
 * Update a user. Only that user should be able to do this.
 * 
 * Data can include: 
 *  { firstName, lastName, password, email }
 * 
 * Returns { username, firstName, lastName, email }
 * 
*/

router.patch("/:username", /** ensureLoggedIn, ensureCorrectUser */ async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const err = validator.errors.map(e => e.stack);
            throw new BadRequestError(err);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });

    } catch (error) {
        return next(error);
    }
})

/** DELETE /[username]
 * 
 * Delete a user. Only that user should be able to do this.
 * 
 * It should return:
 *  { deleted: [username] }
 * 
 * If user cannot be found, return a 404 error
 * 
 */

router.delete("/:username", /** ensureLoggedIn, ensureCorrectUser */ async function (req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({ deleted: req.params.username });

    } catch (error) {
        return next(error)
    }
})


/** POST 
 * 
 * Returns {"favorited": battleId}
 * 
 * Authorization requires: same user
 * 
*/

router.post("/:username/favorites/:id", /** ensureLoggedIn, ensureCorrectUser */ async function (req, res, next) {
    try {
        const pokemonId = req.params.id;
        await User.favorited(req.params.username, pokemonId);
        return res.json({ favorited: pokemonId });

    } catch (error) {
        return next(error)
    }
})


module.exports = router;