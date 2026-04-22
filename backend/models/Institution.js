// filepath: backend/models/Institution.js
const db = require('../config/database');

class Institution {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM institutions WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM institutions ORDER BY name ASC'
    );
    return rows;
  }

  static async create(institutionData) {
    const [result] = await db.execute(
      `INSERT INTO institutions (name, location, contact_email, phone, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        institutionData.name,
        institutionData.location || null,
        institutionData.contact_email || null,
        institutionData.phone || null
      ]
    );
    return result.insertId;
  }

  static async update(id, institutionData) {
    const updates = [];
    const values = [];

    if (institutionData.name) {
      updates.push('name = ?');
      values.push(institutionData.name);
    }
    if (institutionData.location) {
      updates.push('location = ?');
      values.push(institutionData.location);
    }
    if (institutionData.contact_email) {
      updates.push('contact_email = ?');
      values.push(institutionData.contact_email);
    }
    if (institutionData.phone) {
      updates.push('phone = ?');
      values.push(institutionData.phone);
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE institutions SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async delete(id) {
    await db.execute('DELETE FROM institutions WHERE id = ?', [id]);
  }
}

module.exports = Institution;