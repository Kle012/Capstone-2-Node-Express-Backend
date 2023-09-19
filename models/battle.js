"use strict";

const axios = require("axios");
const choose = require("../helper/choice");
const BASE_API = "https://pokeapi.co/api/v2/pokemon"

/** Related function for battles. */

class Battle {

    static async getRandPoke() {
        const randIdx = choose();
        const result = await axios.get(`${BASE_API}/${randIdx}`);
        return result.data;
    }
}



module.exports = Battle;