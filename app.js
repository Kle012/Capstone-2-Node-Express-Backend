/** Express app for pokemon */

const express = require('express');
const cors = require('cors');

const { authenticateJWT } = require('./middleware/auth');
const { NotFoundError } = require('./expressError');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const pokemonRouters = require('./routes/pokemon');
const battleRouters = require('./routes/battles');

const app = express();


/** allow both form-encoded and json body parsing */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** allow connections to all routes from any browser */
app.use(cors());

/** get auth token for all routes */
app.use(authenticateJWT);

/** routes */
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/pokemon", pokemonRouters);
app.use("/battles", battleRouters);


/** 404 Handler */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});


/** Generic error handler; anything unhandled goes here */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});


module.exports = app;