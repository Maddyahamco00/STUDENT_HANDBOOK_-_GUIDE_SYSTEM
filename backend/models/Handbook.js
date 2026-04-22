// filepath: backend/models/Handbook.js
const db = require('../config/database');

class Handbook {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM handbooks WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByInstitution(institutionId) {
    const [rows] = await db.execute(
      'SELECT * FROM handbooks WHERE institution_id = ? ORDER BY created_at DESC',
      [institutionId]
    );
    return rows;
  }

  static async create(handbookData) {
    const [result] = await db.execute(
      `INSERT INTO handbooks (institution_id, title, description, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [
        handbookData.institution_id,
        handbookData.title,
        handbookData.description || null
      ]
    );
    return result.insertId;
  }

  static async update(id, handbookData) {
    const updates = [];
    const values = [];

    if (handbookData.title) {
      updates.push('title = ?');
      values.push(handbookData.title);
    }
    if (handbookData.description) {
      updates.push('description = ?');
      values.push(handbookData.description);
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE handbooks SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async delete(id) {
    await db.execute('DELETE FROM handbook_sections WHERE handbook_id = ?', [id]);
    await db.execute('DELETE FROM handbooks WHERE id = ?', [id]);
  }
}

module.exports = Handbook;