import sql from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static create = async ({ username, email, password }) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [user] = await sql`
        INSERT INTO users (username , email, password)
        VALUES (${username},${email}, ${hashedPassword})
        RETURNING username,id, email
      `;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  };

  static findByEmail = async (email) => {
    try {
      const [user] = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      return user;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch user');
    }
  };

  static updatePassword = async (userId, newPassword) => {
    try {
      await sql.begin(async (sql) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await sql`
          UPDATE users SET password = ${hashedPassword}
          WHERE id = ${userId}
        `;
        await sql`
          UPDATE password_reset_tokens SET used = true
          WHERE user_id = ${userId}
        `;
      });
    } catch (error) {
      console.error('Password update error:', error);
      throw new Error('Failed to update password');
    }
  };

  static createPasswordResetToken = async (userId, token, expiresAt) => {
    try {
      await sql`
        UPDATE password_reset_tokens
        SET used = true
        WHERE user_id = ${userId} AND used = false
      `;

      await sql`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (${userId}, ${token}, ${expiresAt})
      `;
    } catch (error) {
      console.error('Password reset token creation error:', error);
      throw new Error('Failed to create password reset token');
    }
  };

  static verifyPasswordResetToken = async (token) => {
    try {
      const [result] = await sql`
      SELECT user_id FROM password_reset_tokens WHERE token = ${token} AND expires_at > NOW() AND used = false`;
      return result;
    } catch (error) {
      console.error('Password reset token verification error:', error);
      throw new Error('Failed to verify password reset token');
    }
  };

  static markPasswordResetTokenAsUsed = async (token) => {
    try {
      await sql`
        UPDATE password_reset_tokens SET used = true
        WHERE token = ${token}
      `;
    } catch (error) {
      console.error('Password reset token marking error:', error);
      throw new Error('Failed to mark password reset token as used');
    }
  };
}

export default User;
