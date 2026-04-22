// filepath: backend/models/StudentProgress.js
const db = require('../config/database');

class StudentProgress {
  static async findByUserAndStep(userId, stepId) {
    const [rows] = await db.execute(
      'SELECT * FROM student_progress WHERE user_id = ? AND step_id = ?',
      [userId, stepId]
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const [rows] = await db.execute(
      `SELECT sp.*, rs.title as step_title, rs.description, rs.deadline, rs.required_documents, rs.step_order
       FROM student_progress sp
       JOIN registration_steps rs ON sp.step_id = rs.id
       WHERE sp.user_id = ?
       ORDER BY rs.step_order ASC`,
      [userId]
    );
    return rows;
  }

  static async create(progressData) {
    const [result] = await db.execute(
      `INSERT INTO student_progress (user_id, step_id, status, document_path, completed_at, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        progressData.user_id,
        progressData.step_id,
        progressData.status || 'pending',
        progressData.document_path || null,
        progressData.status === 'completed' ? new Date() : null
      ]
    );
    return result.insertId;
  }

  static async updateStatus(userId, stepId, status, documentPath = null) {
    const existing = await this.findByUserAndStep(userId, stepId);

    if (existing) {
      const updates = ['status = ?'];
      const values = [status];

      if (documentPath) {
        updates.push('document_path = ?');
        values.push(documentPath);
      }

      if (status === 'completed') {
        updates.push('completed_at = NOW()');
      }

      values.push(userId, stepId);

      await db.execute(
        `UPDATE student_progress SET ${updates.join(', ')} WHERE user_id = ? AND step_id = ?`,
        values
      );
    } else {
      await this.create({
        user_id: userId,
        step_id: stepId,
        status,
        document_path: documentPath
      });
    }
  }

  static async getProgressStats(userId) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total_steps,
        SUM(CASE WHEN sp.status = 'completed' THEN 1 ELSE 0 END) as completed_steps,
        SUM(CASE WHEN sp.status = 'pending' THEN 1 ELSE 0 END) as pending_steps
       FROM registration_steps rs
       LEFT JOIN student_progress sp ON rs.id = sp.step_id AND sp.user_id = ?
       WHERE rs.institution_id = (SELECT institution_id FROM users WHERE id = ?)`,
      [userId, userId]
    );
    return rows[0];
  }
}

module.exports = StudentProgress;