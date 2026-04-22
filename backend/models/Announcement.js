// filepath: backend/models/Announcement.js
const db = require('../config/database');

class Announcement {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByInstitution(institutionId, limit = 10) {
    const [rows] = await db.execute(
      `SELECT * FROM announcements 
       WHERE institution_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [institutionId, limit]
    );
    return rows;
  }

  static async findActive(institutionId) {
    const [rows] = await db.execute(
      `SELECT * FROM announcements 
       WHERE institution_id = ? AND (deadline IS NULL OR deadline >= CURDATE())
       ORDER BY created_at DESC`,
      [institutionId]
    );
    return rows;
  }

  static async create(announcementData) {
    const [result] = await db.execute(
      `INSERT INTO announcements (institution_id, title, message, deadline, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        announcementData.institution_id,
        announcementData.title,
        announcementData.message,
        announcementData.deadline || null
      ]
    );
    return result.insertId;
  }

  static async update(id, announcementData) {
    const updates = [];
    const values = [];

    if (announcementData.title) {
      updates.push('title = ?');
      values.push(announcementData.title);
    }
    if (announcementData.message) {
      updates.push('message = ?');
      values.push(announcementData.message);
    }
    if (announcementData.deadline !== undefined) {
      updates.push('deadline = ?');
      values.push(announcementData.deadline);
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async delete(id) {
    await db.execute('DELETE FROM announcements WHERE id = ?', [id]);
  }
}

module.exports = Announcement;