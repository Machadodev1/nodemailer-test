import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/connectiondb.js';
import * as registerController from './controllers/register.controller.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.get('/error', (req, res) => {
  const status = Number(req.query.status) || 500;
  const error = req.query.error ? decodeURIComponent(req.query.error) : 'Ha ocurrido un error';
  return res.status(status).render('error', { status, error });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.render('index'));
app.get('/register', registerController.showForm);
app.post('/register', registerController.handleRegister);

// Users CRUD
import * as usersController from './controllers/users.controller.js';
app.get('/users', usersController.listUsers);
app.get('/users/new', usersController.showCreateUser);
app.post('/users', usersController.handleCreateUser);
app.get('/users/:id/edit', usersController.showEditUser);
app.post('/users/:id/update', usersController.handleUpdateUser);
app.post('/users/:id/delete', usersController.handleDeleteUser);

// Clients CRUD
import * as clientsController from './controllers/clients.controller.js';
app.get('/clients', clientsController.listClients);
app.get('/clients/new', clientsController.showCreateClient);
app.post('/clients', clientsController.handleCreateClient);
app.get('/clients/:id/edit', clientsController.showEditClient);
app.post('/clients/:id/update', clientsController.handleUpdateClient);
app.post('/clients/:id/delete', clientsController.handleDeleteClient);

app.use((req, res) => {
  return res.status(404).render('error', {
    status: 404,
    error: 'Página no encontrada',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err?.status || 500;
  const message = err?.message || 'Error interno del servidor';

  return res.status(status).render('error', {
    status,
    error: message,
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error iniciando la aplicación:', err);
    process.exit(1);
  }
}

start();