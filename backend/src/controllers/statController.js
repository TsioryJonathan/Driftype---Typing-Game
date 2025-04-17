import sql from '../config/db.js';
import User from '../models/user.js';

export const getRecentUserStat = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(404).json({ message: 'User not logged In' });
  }

  try {
    const data =
      await sql`SELECT game_statistics.created_at , accuracy , wpm , time_taken , language , difficulty  FROM game_statistics inner join users on game_statistics.user_id = "users".id where "users".id = ${userId} order by created_at desc limit 10 `;

    res.json(data);
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

export const getSpecificStat = async (req, res) => {
  const userId = req.params.userId;
  const { language, difficulty, time_taken } = req.query;

  try {
    const whereParts = [];
    const values = [];

    // Ajout dynamique des filtres
    if (userId) {
      whereParts.push(`user_id = $${values.length + 1}`);
      values.push(userId);
    }

    if (language) {
      whereParts.push(`language = $${values.length + 1}`);
      values.push(language);
    }

    if (difficulty) {
      whereParts.push(`difficulty = $${values.length + 1}`);
      values.push(difficulty);
    }

    if (time_taken) {
      whereParts.push(`time_taken = $${values.length + 1}`);
      values.push(time_taken);
    }

    const whereClause =
      whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const query = `
      SELECT * FROM game_statistics
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const data = await sql.unsafe(query, values);
    res.json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'fetch error' });
  }
};

export const getOverallStat = async (req, res) => {
  const userId = req.params.userId;

  try {
    const data =
      await sql`select count(*) as total_test , max(wpm) as max_wpm , avg(wpm) as avg_wpm ,
    avg(accuracy) as avg_accuracy from game_statistics where user_id = ${userId}`;

    res.json(data);
  } catch (err) {
    res.status(404).send({ Mess: err });
  }
};
