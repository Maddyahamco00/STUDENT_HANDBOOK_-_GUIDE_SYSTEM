// filepath: backend/models/User.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, role, institution_id, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        userData.name,
        userData.email,
        hashedPassword,
        userData.role || 'student',
        userData.institution_id || null
      ]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const updates = [];
    const values = [];

    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(userData.password, 10));
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll(institutionId = null) {
    let query = 'SELECT id, name, email, role, institution_id, created_at FROM users';
    let params = [];

    if (institutionId) {
      query += ' WHERE institution_id = ?';
      params.push(institutionId);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async delete(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;