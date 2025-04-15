import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getStatistics } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', authMiddleware, getStatistics);

// Ajout de l'endpoint POST pour enregistrer une partie
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { wpm, accuracy, time_taken, text_length } = req.body;
    if (
      typeof wpm !== 'number' ||
      typeof accuracy !== 'number' ||
      typeof time_taken !== 'number' ||
      typeof text_length !== 'number'
    ) {
      return res.status(400).json({ error: 'Champs manquants ou invalides' });
    }

    await import('../config/db.js').then(({ default: sql }) => sql`
      INSERT INTO game_statistics (user_id, wpm, accuracy, time_taken, text_length)
      VALUES (${userId}, ${wpm}, ${accuracy}, ${time_taken}, ${text_length})
    `);
    res.status(201).json({ message: 'Stat enregistrée' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des stats:', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

export default router;
