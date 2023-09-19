"use strict";

/** Database setup for pokemon. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "test") {
    db = new Client({
        connectionString: getDatabaseUri(),
        // ssl: {
        //     rejectUnauthorized: false
        // }
    });
} else {
    db = new Client({
        connectionString: getDatabaseUri()
    });
}

db.connect();

module.exports = db;