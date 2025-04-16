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
  const { wpm, accuracy, time_taken, text_length } = req.body;

  if (!userId) {
    return res.status(404).json({ message: 'User not logged In' });
  }

  try {
    await sql`insert into game_statistics (user_id, wpm, accuracy, time_taken, text_length, created_at)
          values (${userId}, ${wpm}, ${accuracy}, ${time_taken}, ${text_length}, now())`;

    res.json({ Mess: 'Data insert succes' });
  } catch (e) {
    console.log(e.detail);
  }
};
