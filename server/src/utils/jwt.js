import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Token helpers. Access tokens are short-lived and sent to the client;
 * refresh tokens are long-lived and used only to mint new access tokens.
 */
export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

/** Issue both tokens at once for a given user. */
export const generateAuthTokens = (user) => {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};
