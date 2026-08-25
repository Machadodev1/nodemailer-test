import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/connectiondb.js';
import authRoutes from './routes/auth.routes.js';
import registerRoutes from './routes/register.routes.js';
import usersRoutes from './routes/users.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.get('/', authenticateToken, (req, res) => res.render('index'));
app.use(registerRoutes);
app.use('/users', usersRoutes);
app.use('/clients', clientsRoutes);

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
