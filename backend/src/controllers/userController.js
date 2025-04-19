import sql from "../config/db.js";

export const getUserDetail = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.json({ Username: "Guest" });
  try {
    const username = await sql`select username from users where id = ${userId}`;
    res.json(username);
  } catch (e) {
    console.log(e);
  }
};

export const updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const { username, email } = req.body;

  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!username || !email) {
    return res.status(400).json({ message: "Username and email are required" });
  }

  
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    
    const emailExists =
      await sql`SELECT 1 FROM users WHERE email = ${email} AND id != ${userId}`;
    if (emailExists.length > 0) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another account" });
    }

    
    const usernameExists =
      await sql`SELECT 1 FROM users WHERE username = ${username} AND id != ${userId}`;
    if (usernameExists.length > 0) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    
    const result = await sql`
      UPDATE users
      SET username = ${username}, email = ${email}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, username, email
    `;

    
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const updatedUser = result[0];
    res.json({
      message: "User details updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserBio = async (req, res) => {
  const { bio } = req.body;
  const userId = req.params.userId;

  if (!bio || typeof bio !== "string")
    return res.status(400).json({ message: "Invalid bio" });

  try {
    await sql`
      UPDATE users
      SET bio = ${bio}
      WHERE id = ${userId}
    `;
    res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
    console.error("Failed to update bio:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBio = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [user] = await sql`
      SELECT bio FROM users WHERE id = ${userId}
    `;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ bio: user.bio });
  } catch (error) {
    console.error("Error fetching user bio:", error);
    res.status(500).json({ message: "Server error" });
  }
};
