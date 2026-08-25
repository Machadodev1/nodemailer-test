import jwt from 'jsonwebtoken';

function getCookieToken(req) {
  const cookies = req.headers.cookie || '';
  const authCookie = cookies.split(';').find((cookie) => cookie.trim().startsWith('authToken='));
  return authCookie ? decodeURIComponent(authCookie.split('=').slice(1).join('=').trim()) : null;
}

function authenticationError(req, res, status, message) {
  if (req.accepts('html')) {
    return res.redirect('/auth/login');
  }

  return res.status(status).json({
    success: false,
    message,
  });
}

export function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  let token;

  if (authorization) {
    const [scheme, bearerToken] = authorization.split(' ');
    if (scheme !== 'Bearer' || !bearerToken || authorization.split(' ').length !== 2) {
      return authenticationError(req, res, 401, 'El token debe usar el formato Bearer');
    }

    token = bearerToken;
  } else {
    token = getCookieToken(req);
  }

  if (!token) {
    return authenticationError(req, res, 401, 'Token de autenticación requerido');
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no está configurado');
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return authenticationError(req, res, 403, 'Token inválido o expirado');
  }
}
