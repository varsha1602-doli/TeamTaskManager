const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });

  res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
  res.status(201).json({ success: true, data: user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
  res.status(200).json({ success: true, data: user });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, data: user });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie(config.jwt.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});
