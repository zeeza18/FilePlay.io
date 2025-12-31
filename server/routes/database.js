import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Get SQLite database schema
router.post('/schema', (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const db = new Database(filePath, { readonly: true });

    // Get all tables
    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

    const schema = {};
    for (const table of tables) {
      const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
      const rowCount = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();

      schema[table.name] = {
        columns: columns.map(col => ({
          name: col.name,
          type: col.type,
          notNull: col.notnull === 1,
          defaultValue: col.dflt_value,
          primaryKey: col.pk === 1
        })),
        rowCount: rowCount.count
      };
    }

    db.close();

    res.json({ tables: Object.keys(schema), schema });
  } catch (error) {
    console.error('Database schema error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Query SQLite database
router.post('/query', (req, res) => {
  try {
    const { fileId, table, page = 1, limit = 100 } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const db = new Database(filePath, { readonly: true });

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM ${table}`).get();

    // Get paginated data
    const rows = db.prepare(`SELECT * FROM ${table} LIMIT ? OFFSET ?`).all(limit, offset);

    // Get columns
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();

    db.close();

    res.json({
      table,
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      columns: columns.map(col => col.name),
      rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Execute custom SQL query (read-only)
router.post('/execute', (req, res) => {
  try {
    const { fileId, sql } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Only allow SELECT queries
    if (!sql.trim().toLowerCase().startsWith('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    const db = new Database(filePath, { readonly: true });
    const rows = db.prepare(sql).all();
    db.close();

    res.json({ rows });
  } catch (error) {
    console.error('Database execute error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
