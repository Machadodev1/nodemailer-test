import Usuario from '../models/user.model.js';
import bcrypt from 'bcrypt';

export async function listUsers(req, res) {
  const users = await Usuario.find().lean();
  res.render('listUsers', { users });
}

export async function showCreateUser(req, res) {
  res.render('createUser');
}

export async function handleCreateUser(req, res) {
  try {
    const { correo, contra, rol } = req.body;
    const passwordHash = await bcrypt.hash(contra, 10);

    const usuario = new Usuario({ 
      correo, 
      contra: passwordHash, 
      rol 
    });

    await usuario.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(400).render('createUser', { error: 'Error creando usuario' });
  }
}

export async function showEditUser(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id).lean();
    if (!usuario) return res.redirect('/users');
    res.render('editUser', { usuario });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
}

export async function handleUpdateUser(req, res) {
  try {
    const { correo, contra, rol } = req.body;
    const updateData = { correo, rol };

    if (contra && contra.trim() !== '') {
      updateData.contra = await bcrypt.hash(contra, 10);
    }

    await Usuario.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(400).render('editUser', { error: 'Error actualizando usuario' });
  }
}

export async function handleDeleteUser(req, res) {
  try {
    console.log('Delete user request id=', req.params.id);
    const deleted = await Usuario.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn('Usuario no encontrado para id=', req.params.id);
    } else {
      console.log('Usuario eliminado:', deleted._id.toString());
    }
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
}
