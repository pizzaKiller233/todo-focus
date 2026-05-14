const express = require('express');
const db = require('../db');

const router = express.Router();

// List all todos
router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  res.json(todos);
});

// Create todo
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const result = db.prepare('INSERT INTO todos (text) VALUES (?)').run(text.trim());
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(todo);
});

// Update todo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' });
  }
  db.prepare("UPDATE todos SET done = ?, updated_at = datetime('now') WHERE id = ?").run(done ? 1 : 0, id);
  res.json({ success: true });
});

// Delete todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' });
  }
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ success: true });
});

module.exports = router;
