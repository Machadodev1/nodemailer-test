import Cliente from '../models/client.model.js';
import { redirectToError } from '../utils/error.js';

export async function listClients(req, res) {
  const clients = await Cliente.find().lean();
  res.render('listClients', { clients });
}

export async function showCreateClient(req, res) {
  res.render('createClient');
}

export async function handleCreateClient(req, res) {
  try {
    const { correo, nombre, telefono } = req.body;
    const cliente = new Cliente({ correo, nombre, telefono });
    await cliente.save();
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    return redirectToError(res, 400, 'Error creando cliente');
  }
}

export async function showEditClient(req, res) {
  try {
    const cliente = await Cliente.findById(req.params.id).lean();
    if (!cliente) return res.redirect('/clients');
    res.render('editClient', { cliente });
  } catch (err) {
    console.error(err);
    return redirectToError(res, 500, 'Error cargando cliente');
  }
}

export async function handleUpdateClient(req, res) {
  try {
    const { correo, nombre, telefono } = req.body;
    await Cliente.findByIdAndUpdate(req.params.id, { correo, nombre, telefono });
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    return redirectToError(res, 400, 'Error actualizando cliente');
  }
}

export async function handleDeleteClient(req, res) {
  try {
    console.log('Delete client request id=', req.params.id);
    const deleted = await Cliente.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn('Cliente no encontrado para id=', req.params.id);
    } else {
      console.log('Cliente eliminado:', deleted._id.toString());
    }
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    return redirectToError(res, 500, 'Error eliminando cliente');
  }
}
