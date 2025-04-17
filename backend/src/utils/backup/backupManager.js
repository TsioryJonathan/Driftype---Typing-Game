import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from '../../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, 'data');
const BACKUP_FILE = path.join(BACKUP_DIR, 'backup.json');

async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

export async function backupData() {
  try {
    await ensureBackupDir();

    // Retrieve data from all tables
    const users = await sql`SELECT * FROM users`;
    const gameStats = await sql`SELECT * FROM game_statistics`;
    const resetTokens = await sql`SELECT * FROM password_reset_tokens`;

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users,
        gameStats,
        resetTokens,
      },
    };

    await fs.writeFile(BACKUP_FILE, JSON.stringify(backup, null, 2));
    console.log('Backup completed successfully');
    return true;
  } catch (error) {
    console.error('Backup failed:', error);
    return false;
  }
}

export async function restoreData() {
  try {
    try {
      await fs.access(BACKUP_FILE);
    } catch {
      console.log('No backup file found');
      return false;
    }

    const backupContent = await fs.readFile(BACKUP_FILE, 'utf-8');
    const backup = JSON.parse(backupContent);

    const userCount = await sql`SELECT COUNT(*) FROM users`;
    if (userCount[0].count > 0) {
      console.log('Database is not empty, skipping restore');
      return false;
    }

    for (const user of backup.data.users) {
      await sql`
                INSERT INTO users (id,username , email, password, created_at, updated_at)
                VALUES (${user.id} , ${user.username} ,  ${user.email}, ${user.password}, ${user.created_at}, ${user.updated_at})
                ON CONFLICT (id) DO NOTHING
            `;
    }

    for (const stat of backup.data.gameStats) {
      await sql`
                INSERT INTO game_statistics (id, user_id, wpm, accuracy, language, difficulty, time_taken,  created_at)
                VALUES (${stat.id}, ${stat.user_id}, ${stat.wpm}, ${stat.accuracy},${stat.language} , ${stat.difficulty} ${stat.time_taken}, ${stat.created_at})
                ON CONFLICT (id) DO NOTHING
            `;
    }

    for (const token of backup.data.resetTokens) {
      await sql`
                INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used, created_at)
                VALUES (${token.id}, ${token.user_id}, ${token.token}, ${token.expires_at}, ${token.used}, ${token.created_at})
                ON CONFLICT (id) DO NOTHING
            `;
    }

    console.log('Restore completed successfully');
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
}
