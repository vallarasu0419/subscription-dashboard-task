import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateAuthTokens,
  verifyRefreshToken,
} from '../utils/jwt.js';

/**
 * Persist the hash of the issued refresh token so it can be invalidated on logout
 * and so a stolen-but-rotated token cannot be reused.
 */
const persistRefreshToken = async (user, refreshToken) => {
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
};

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role });
  const tokens = generateAuthTokens(user);
  await persistRefreshToken(user, tokens.refreshToken);

  return { user: user.toJSON(), tokens };
};

export const loginUser = async ({ email, password }) => {
  // Password and refreshTokenHash are select:false, so request them explicitly.
  const user = await User.findOne({ email }).select('+password +refreshTokenHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const tokens = generateAuthTokens(user);
  await persistRefreshToken(user, tokens.refreshToken);

  return { user: user.toJSON(), tokens };
};

export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token is missing');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Refresh token is invalid or expired');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash) {
    throw ApiError.unauthorized('Session no longer valid');
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  // Rotate: issue a new pair and store the new hash.
  const tokens = generateAuthTokens(user);
  await persistRefreshToken(user, tokens.refreshToken);

  return { user: user.toJSON(), tokens };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
};
