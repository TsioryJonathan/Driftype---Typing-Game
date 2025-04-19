import sql from '../config/db.js';
/* export const getStatistics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get recent games statistics
    const [recentStats] = await sql`
      SELECT 
        ROUND(AVG(wpm)) as avg_wpm,
        ROUND(AVG(accuracy), 2) as avg_accuracy,
        MAX(wpm) as best_wpm,
        COUNT(*) as games_played
      FROM game_statistics 
      WHERE user_id = ${userId}
    `;

    // Get WPM and accuracy progression (last 10 games)
    const progression = await sql`
      SELECT wpm, accuracy, created_at
      FROM game_statistics 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    res.json({
      recentStats,
      progression: progression.reverse() // Reverse to show oldest to newest
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { getStatistics }; */ ('depreceted');
