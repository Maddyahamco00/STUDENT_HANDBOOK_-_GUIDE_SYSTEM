// filepath: backend/models/HandbookSection.js
const db = require('../config/database');

class HandbookSection {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM handbook_sections WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByHandbook(handbookId) {
    const [rows] = await db.execute(
      'SELECT * FROM handbook_sections WHERE handbook_id = ? ORDER BY section_order ASC',
      [handbookId]
    );
    return rows;
  }

  static async create(sectionData) {
    const [result] = await db.execute(
      `INSERT INTO handbook_sections (handbook_id, title, content, section_order, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        sectionData.handbook_id,
        sectionData.title,
        sectionData.content,
        sectionData.section_order || 0
      ]
    );
    return result.insertId;
  }

  static async update(id, sectionData) {
    const updates = [];
    const values = [];

    if (sectionData.title) {
      updates.push('title = ?');
      values.push(sectionData.title);
    }
    if (sectionData.content) {
      updates.push('content = ?');
      values.push(sectionData.content);
    }
    if (sectionData.section_order !== undefined) {
      updates.push('section_order = ?');
      values.push(sectionData.section_order);
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE handbook_sections SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async delete(id) {
    await db.execute('DELETE FROM handbook_sections WHERE id = ?', [id]);
  }
}

module.exports = HandbookSection;