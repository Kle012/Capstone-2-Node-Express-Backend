const axios = require("axios");

const BASE_API = "https://pokeapi.co/api/v2/pokemon"

/** Related function for Pokemon */

class Pokemon {
    /** Find all pokemon  */

    static async showAll() {
        const res = await axios.get(`${BASE_API}?limit=100`);
        return res.data;
    }

    /** Find a pokemon based on name */
    
    static async showOne(name) {
        const res = await axios.get(`${BASE_API}/${name}`);
        return res.data;
    }
}


module.exports = Pokemon;

