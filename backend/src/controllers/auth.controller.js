import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/* ======================
   SIGNUP (CUSTOMER / AGENT)
====================== */
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // 1. Validate role
  if (!["CUSTOMER", "AGENT"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  
  // 2. Check existing user
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 3. Hash password
  const hash = await bcrypt.hash(password, 10);

  // 4. Create user
  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    role,
    authProvider: "LOCAL",
    agentStatus:
      role === "AGENT"
        ? { approved: false }
        : undefined
  });

  // 5. Issue JWT
  const token = generateToken(user);

  res.status(201).json({
    token,
    role: user.role,
    agentApproved: role === "AGENT" ? false : true
  });
};


/* ======================
   LOGIN (ALL ROLES)
====================== */
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);
  res.json({
    token,
    role: user.role,
    agentApproved: user.agentStatus?.approved ?? true
  });
};

/* ======================
   GOOGLE SIGNIN / SIGNUP
   (CUSTOMER ONLY)
====================== */
export const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID token missing" });
  }

  try {
    // 1. Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: "Email not verified by Google" });
    }

    // 2. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: "CUSTOMER",
        authProvider: "GOOGLE",
        passwordHash: null
      });
    }

    // 3. Block Google auth for agents/admins
    if (user.role !== "CUSTOMER") {
      return res
        .status(403)
        .json({ message: "Google login not allowed for this role" });
    }

    // 4. Issue your own JWT
    const token = generateToken(user);

    res.json({
      token,
      role: user.role
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

/* ======================
   GET CURRENT USER
====================== */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "_id name email role agentStatus authProvider"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      agentApproved: user.agentStatus?.approved ?? true,
      authProvider: user.authProvider
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};