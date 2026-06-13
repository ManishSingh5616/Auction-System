const User = require("../models/User.model");
const { generateTokenAndSetCookie } = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });

    // Only allow bidder or consignor on self-registration
    const allowedRoles = ["bidder", "consignor"];
    const assignedRole = allowedRoles.includes(role) ? role : "bidder";

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ success: false, message: "Email is already registered." });

    const user = await User.create({ name, email, password, role: assignedRole });
    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};

const getMe = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, logout, getMe };
