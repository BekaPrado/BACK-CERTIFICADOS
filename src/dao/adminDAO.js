const pool = require("../config/db");

module.exports = {
    async findByEmail(email) {
        const [rows] = await pool.query("SELECT * FROM admin WHERE email = ?", [email]);
        return rows[0];
    }
};
 