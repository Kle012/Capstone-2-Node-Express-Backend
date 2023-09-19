const { BadRequestError } = require('../expressError');

/**
 * Helper for making selective update queries.
 * 
 * The calling function can use it to make the SET clause of an SQL UPDATE statement
 * 
 * @example {firstName: 'Mindy', lastName: 'June'} => 
 *  { setCols: '"first_name" = $1, "last_name" = $2',
 *  values: ['Mindy', 'June'] }
 * 
 */


function partialUpdate(data, jsToSql) {
    const keys = Object.keys(data);
    if (keys.length === 0) throw new BadRequestError("No data");

    // {firstName = 'Mindy', lastName = 'June'} => ['"first_name" = $1, "last_name" = $2']
    const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`,)

    return {
        setCols: cols.join(", "),
        values: Object.values(data),
    }
}


module.exports = { partialUpdate }