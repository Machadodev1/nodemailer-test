import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/user.model.js';

export function showLogin(req, res) {
  return res.render('login');
}

export function logout(req, res) {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada',
  });
}

export async function login(req, res) {
  try {
    const { correo, contra } = req.body;

    if (!correo || !contra) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios',
      });
    }

    const usuario = await Usuario.findOne({ correo });
    const passwordValida = usuario
      ? await bcrypt.compare(contra, usuario.contra)
      : false;

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado');
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }

    const payload = {
      id: usuario._id.toString(),
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error('Error durante el login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
