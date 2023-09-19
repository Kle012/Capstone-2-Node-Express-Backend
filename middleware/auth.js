"use strict";

/**  Middleware for handling req authorization for routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** Middleware: Authenticate user.
 * 
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals
 * 
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();

    } catch (error) {
        return next();
    }
}


/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();

    } catch (error) {
        return next(error);
    }

}


/** Middleware: Requires user is authenticated and match the username provided as route param */

function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && user.username === req.params.username)) {
            throw new UnauthorizedError();
        }
        return next();

    } catch (error) {
        return next(error);
    }
}


module.exports = { authenticateJWT, ensureLoggedIn, ensureCorrectUser }