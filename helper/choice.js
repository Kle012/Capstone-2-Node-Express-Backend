/** External API has a strange id sequence, 
 * it starts from 0 up to 1010,
 * then it jumps to 10001
 * 
 * For the sake of my sanity, I chose to hard code
 * the random id up to 1010
 */

function choose() {
    return (Math.floor(Math.random() * 1011));
}

module.exports = choose;