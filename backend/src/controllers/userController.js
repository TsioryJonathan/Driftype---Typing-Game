import sql from '../config/db.js';

export const getUserDetail = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.json({ Username: 'Guest' });
  try {
    const username = await sql`select username from users where id = ${userId}`;
    res.json(username);
  } catch (e) {
    console.log(e);
  }
};
