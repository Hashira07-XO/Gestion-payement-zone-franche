import db from '../config/database.js';

class Auth {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }


    async login() {
        try {
            const query = `SELECT * FROM administrateurs WHERE username = ? AND password = ?`;
            const [rows] = await db.query(query, [this.username, this.password]);
            return rows; 
        } catch (error) {
            throw error; 
        }
    }
    async updatePassword(id_admin, newPassword) {
        try {
            const query = `UPDATE administrateurs SET password = ? WHERE id_admin = ?`;
            const [result] = await db.query(query, [newPassword, id_admin]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default Auth;