const { query } = require('./sqlquery');

const getUniversities = async () => {
    var res = [];
    const r = await query('select * from University', '');
    for (var i = 0; i < r.length; i++) {
        res.push({ key: r[i].allias, value: r[i].University_Name });
    }
    return res;
} 

module.exports = { getUniversities };