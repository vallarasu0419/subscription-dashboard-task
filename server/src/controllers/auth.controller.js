import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
} from '../services/auth.service.js';

const REFRESH_COOKIE = 'refreshToken';

// httpOnly cookie keeps the refresh token out of reach of client-side JS (XSS-safe).
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

const setRefreshCookie = (res, token) =>
  res.cookie(REFRESH_COOKIE, token, refreshCookieOptions);

export const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await registerUser(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  return sendResponse(res, 201, 'Registration successful', {
    user,
    accessToken: tokens.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await loginUser(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  return sendResponse(res, 200, 'Login successful', {
    user,
    accessToken: tokens.accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  const { user, tokens } = await refreshTokens(token);
  setRefreshCookie(res, tokens.refreshToken);
  return sendResponse(res, 200, 'Token refreshed', {
    user,
    accessToken: tokens.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await logoutUser(req.user.id);
  }
  res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions, maxAge: undefined });
  return sendResponse(res, 200, 'Logout successful');
});

export const getProfile = asyncHandler(async (req, res) =>
  sendResponse(res, 200, 'Profile fetched', { user: req.user.toJSON() })
);
