// controllers/authController.js
const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { user, token },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user, token },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
