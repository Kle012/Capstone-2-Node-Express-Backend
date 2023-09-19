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


/**
 * 
 * /* 
  Snake to camel: Convert variable_like_this to variableLikeThis
*/

// function snakeToCamel('hello_world') = 'helloWorld';
// function snakeToCamel('Hello_World') = 'HelloWorld'; 
// just strings

// replace (thing you try to replace, and the thing try to replace with)

// function snakeToCamel(str) {
//     let string = '';
//     for (let i = 0; i < str.length; i++) {
//       let char = str[i];
//       if (char === '_') {
//         string += (str[i + 1]).toUpperCase();
//         i++; 
//       }
//       else {
//         string += char;
//       }
//     }
  
//     return string;
//   }
  
//   console.log(snakeToCamel('hello_world'));
//  */
/**
 * function findDouble(arr, num) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (num === arr[i]) count++;
    if (count >= 1 ) return true;
    
  }

  return false;
}

 */