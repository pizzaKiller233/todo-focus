const express = require('express');
const db = require('../db');

const router = express.Router();

const TODAY = () => new Date().toISOString().slice(0, 10);

// Get today's focus data
router.get('/today', (req, res) => {
  const date = TODAY();
  const sessions = db.prepare('SELECT * FROM focus_sessions WHERE date = ? ORDER BY created_at').all(date);
  const totalSeconds = sessions.reduce((sum, s) => sum + s.seconds, 0);
  res.json({ date, total_seconds: totalSeconds, sessions });
});

// Add focus session
router.post('/session', (req, res) => {
  const { start_time, seconds } = req.body;
  if (!start_time || seconds == null) {
    return res.status(400).json({ error: 'start_time and seconds are required' });
  }
  const date = TODAY();
  const result = db.prepare(
    'INSERT INTO focus_sessions (date, start_time, seconds) VALUES (?, ?, ?)'
  ).run(date, start_time, Math.round(seconds));
  const session = db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(session);
});

// Delete focus session
router.delete('/session/:id', (req, res) => {
  const { id } = req.params;
  const session = db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(id);
  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }
  db.prepare('DELETE FROM focus_sessions WHERE id = ?').run(id);
  res.json({ success: true });
});

// Get daily goal
router.get('/goal', (req, res) => {
  const goal = db.prepare('SELECT goal_minutes FROM daily_goal WHERE id = 1').get();
  res.json({ goal_minutes: goal.goal_minutes });
});

// Update daily goal
router.put('/goal', (req, res) => {
  const { goal_minutes } = req.body;
  if (!goal_minutes || goal_minutes < 1) {
    return res.status(400).json({ error: 'goal_minutes is required and must be > 0' });
  }
  db.prepare("UPDATE daily_goal SET goal_minutes = ?, updated_at = datetime('now') WHERE id = 1").run(goal_minutes);
  res.json({ goal_minutes });
});

// Get history (last 30 days)
router.get('/history', (req, res) => {
  const history = db.prepare(`
    SELECT date, SUM(seconds) as total_seconds, COUNT(*) as session_count
    FROM focus_sessions
    GROUP BY date
    ORDER BY date DESC
    LIMIT 30
  `).all();
  res.json(history);
});

module.exports = router;
