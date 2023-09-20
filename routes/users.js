"use strict";

/** Routes for users */

const express = require('express');
const jsonschema = require('jsonschema');
const { ensureCorrectUser, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');

const User = require('../models/user');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();


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

router.get("/:username", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
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

router.patch("/:username", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
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


module.exports = router;