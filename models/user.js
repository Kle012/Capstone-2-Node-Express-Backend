"use strict";

const db = require('../db');
const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { partialUpdate } = require('../helper/sql');

const { BCRYPT_WORK_FACTOR } = require('../config');

/** Related function for users. */

class User {
    /** Authenticate user with username and password
     * 
     * Returns { username, firstName, lastName, email }
     * 
     * Throws UnauthorizedError when the user is not found or wrong password
     */

    static async authenticate(username, password) {
        // find the user first
        const res = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = res.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }


    /** Register user with data
     * 
     * Returns { username, firstName, lastName, email }
     * 
     * Throws BadRequestError on duplicates
    */

    static async register(
        { username, password, firstName, lastName, email }
    ) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        };

        const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const res = await db.query(
            `INSERT INTO users
            (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING username, first_name AS "fistName", last_name AS "lastName", email,`
            [username,
            hashedPwd,
            firstName,
            lastName,
            email],
        );

        const user = res.rows[0];

        return user;
    }


    /** Given a username, return data about user
     * 
     * Returns { username, first_name, last_name, email }
     * 
     */

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                first_name AS firstName,
                last_name AS lastName,
                email
            FROM users
            WHERE username = $1`,
            [username],
        )

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }


    /** Update user data
     * 
     * This is a partial update -- meaning data doesn't have to contain all the fields and only change what needed to be
     * 
     * Data can include: 
     *  { firstName, lastName, password, email }
     * 
     * Returns { username, lastName, firstName, email }
     * 
     * Throws NotFoundError if not found
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = partialUpdate(data, { firstName: "first_name", lastName: "last_name", email: "email" })

        const usernameIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameIdx}
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email`;

        const res = await db.query(querySql, [...values, username]);
        const user = res.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }
}


module.exports = User;