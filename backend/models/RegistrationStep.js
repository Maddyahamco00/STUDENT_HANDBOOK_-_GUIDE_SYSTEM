// filepath: backend/models/RegistrationStep.js
const db = require('../config/database');

class RegistrationStep {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM registration_steps WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByInstitution(institutionId) {
    const [rows] = await db.execute(
      'SELECT * FROM registration_steps WHERE institution_id = ? ORDER BY step_order ASC',
      [institutionId]
    );
    return rows;
  }

  static async create(stepData) {
    const [result] = await db.execute(
      `INSERT INTO registration_steps (institution_id, title, description, required_documents, deadline, step_order, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        stepData.institution_id,
        stepData.title,
        stepData.description || null,
        stepData.required_documents || null,
        stepData.deadline || null,
        stepData.step_order || 0
      ]
    );
    return result.insertId;
  }

  static async update(id, stepData) {
    const updates = [];
    const values = [];

    if (stepData.title) {
      updates.push('title = ?');
      values.push(stepData.title);
    }
    if (stepData.description) {
      updates.push('description = ?');
      values.push(stepData.description);
    }
    if (stepData.required_documents) {
      updates.push('required_documents = ?');
      values.push(stepData.required_documents);
    }
    if (stepData.deadline) {
      updates.push('deadline = ?');
      values.push(stepData.deadline);
    }
    if (stepData.step_order !== undefined) {
      updates.push('step_order = ?');
      values.push(stepData.step_order);
    }

    values.push(id);

    if (updates.length > 0) {
      await db.execute(
        `UPDATE registration_steps SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  static async delete(id) {
    await db.execute('DELETE FROM student_progress WHERE step_id = ?', [id]);
    await db.execute('DELETE FROM registration_steps WHERE id = ?', [id]);
  }
}

module.exports = RegistrationStep;