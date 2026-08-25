import Usuario from '../models/user.model.js';
import Cliente from '../models/client.model.js';
import { sendEmail } from '../services/mail.service.js';
import bcrypt from 'bcrypt';
import { redirectToError } from '../utils/error.js';

export async function showForm(req, res) {
  res.render('register');
}

export async function handleRegister(req, res) {
  try {
    const { correo, contra, rol, nombre, telefono } = req.body;

    if (!correo || !contra || !nombre || !telefono) {
      return redirectToError(res, 400, 'Todos los campos son obligatorios');
    }

    const passwordHash = await bcrypt.hash(contra, 10);
    const usuario = new Usuario({ correo, contra: passwordHash, rol });
    const cliente = new Cliente({ correo, nombre, telefono });

    await Promise.all([
      usuario.save(),
      cliente.save(),
    ]);

    try {
      const info = await sendEmail(correo, 'Registro exitoso', `Hola ${nombre},\n\nTu registro se completó correctamente.\n\nSaludos!`);
      return res.render('success', {
        message: 'Registro completo. Revisa tu correo.',
        mailInfo: info && info.response ? info.response : info,
      });
    } catch (mailErr) {
      console.error('Error enviando correo:', mailErr);
      return res.render('success', {
        message: 'Registro completo. Error al enviar correo.',
        mailError: mailErr && mailErr.message ? mailErr.message : String(mailErr),
      });
    }
  } catch (error) {
    console.error(error);
    const msg = error?.code === 11000 ? 'El correo ya está registrado' : 'Error en el registro';
    return redirectToError(res, 400, msg);
  }
}
