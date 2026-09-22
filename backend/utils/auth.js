import jwt from 'jsonwebtoken';

const DEFAULT_CLIENT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const TOKEN_COOKIE_NAME = 'nextdevs_auth';
const TOKEN_TTL = '12h';

const parseDurationToMs = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return 12 * 60 * 60 * 1000;
  }

  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 12 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }

  return secret;
};

export const getAllowedOrigins = () => {
  const envOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...envOrigins, ...DEFAULT_CLIENT_ORIGINS])];
};

export const isAllowedOrigin = (origin) => {
  if (process.env.NODE_ENV !== 'production') return true;
  return !origin || getAllowedOrigins().includes(origin);
};

export const getCookieName = () => process.env.AUTH_COOKIE_NAME || TOKEN_COOKIE_NAME;

export const getJwtConfig = () => ({
  expiresIn: process.env.JWT_EXPIRES_IN || TOKEN_TTL,
  issuer: process.env.JWT_ISSUER || 'nextdevs-api',
  audience: process.env.JWT_AUDIENCE || 'nextdevs-app',
});

export const signAuthToken = (user) => {
  const { expiresIn, issuer, audience } = getJwtConfig();

  return jwt.sign(
    {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion ?? 0,
    },
    getJwtSecret(),
    {
      expiresIn,
      issuer,
      audience,
      algorithm: 'HS256',
    }
  );
};

export const verifyAuthToken = (token) => {
  const { issuer, audience } = getJwtConfig();

  return jwt.verify(token, getJwtSecret(), {
    issuer,
    audience,
    algorithms: ['HS256'],
  });
};

export const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: parseDurationToMs(getJwtConfig().expiresIn),
});

export const setAuthCookie = (res, token) => {
  res.cookie(getCookieName(), token, buildAuthCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(getCookieName(), {
    ...buildAuthCookieOptions(),
    maxAge: undefined,
  });
};

export const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce((accumulator, chunk) => {
    const [rawKey, ...rawValue] = chunk.trim().split('=');

    if (!rawKey) {
      return accumulator;
    }

    accumulator[rawKey] = decodeURIComponent(rawValue.join('='));
    return accumulator;
  }, {});

export const extractTokenFromRequest = (req) => {
  const authorization = req.headers.authorization;

  if (authorization?.startsWith('Bearer ')) {
    return authorization.split(' ')[1];
  }

  return parseCookies(req.headers.cookie)[getCookieName()];
};

export const extractTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken;
  }

  return parseCookies(socket.handshake.headers.cookie)[getCookieName()];
};

export const sanitizeUser = (user, { includeEmail = true } = {}) => {
  const data = typeof user.toObject === 'function' ? user.toObject() : { ...user };

  delete data.password;
  delete data.tokenVersion;
  delete data.__v;

  if (!includeEmail) {
    delete data.email;
  }

  return data;
};

export const setNoStore = (res) => {
  res.set('Cache-Control', 'no-store');
};
