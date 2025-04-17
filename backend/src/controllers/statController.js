import sql from '../config/db.js';
import User from '../models/user.js';

export const getUserStat = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(404).json({ message: 'User not logged In' });
  }

  try {
    const stat =
      await sql`SELECT * FROM game_statistics inner join users on game_statistics.user_id = user.id where user.id = ${userId} limit 10`;

    res.json(stat);
  } catch (e) {
    console.error(e);
  }
};

export const postUserStat = async (req, res) => {
  const userId = req.params.userId;
  const { wpm, accuracy, language, difficulty, time_taken } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  if (!wpm || !accuracy || !language || !difficulty || !time_taken) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await sql`
      INSERT INTO game_statistics (user_id, wpm, accuracy, language, difficulty, time_taken, created_at)
      VALUES (${userId}, ${wpm}, ${accuracy}, ${language}, ${difficulty}, ${time_taken}, NOW())
    `;

    res.status(201).json({ message: 'Stat successfully recorded' });
  } catch (e) {
    console.error('Insert error:', e);
    res
      .status(500)
      .json({ message: 'Database error', error: e.detail || e.message });
  }
};
