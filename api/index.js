import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tareasRouter from './routes/tareas.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// ===============================================================
// Middlewares Globales
// ===============================================================

// 1. Configuración de CORS: Permite peticiones desde cualquier origen y todos los verbos requeridos
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Parser para JSON en el cuerpo de las peticiones (POST, PUT)
app.use(express.json());

// ===============================================================
// Rutas de la Aplicación
// ===============================================================

// Ruta principal informativa / Health check
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: '🚀 API REST conectada con Supabase y lista para Vercel',
    version: '1.0.0',
    rutas_disponibles: {
      'GET /api/tareas': 'Listar todas las tareas',
      'GET /api/tareas/:id': 'Obtener una tarea específica',
      'POST /api/tareas': 'Crear una nueva tarea',
      'PUT /api/tareas/:id': 'Actualizar una tarea existente',
      'DELETE /api/tareas/:id': 'Eliminar una tarea'
    }
  });
});

// Ruta de health check adicional en /api
app.get('/api', (req, res) => {
  res.redirect('/');
});

// Registrar las rutas del módulo de tareas (tanto con prefijo /api/tareas como /tareas)
app.use('/api/tareas', tareasRouter);
app.use('/tareas', tareasRouter);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    ok: false,
    error: 'Ocurrió un error inesperado en el servidor.'
  });
});

// ===============================================================
// Configuración para ejecución local vs Vercel Serverless
// ===============================================================
// En Vercel Serverless, 'process.env.VERCEL' está definido como '1'.
// Si estamos corriendo de forma local con 'npm run dev' o 'node api/index.js',
// levantamos el servidor con app.listen().
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Servidor local corriendo en http://localhost:${PORT}`);
    console.log(` Documentación de rutas: http://localhost:${PORT}/`);
    console.log(`===============================================`);
  });
}

// Exportar la instancia de express para que Vercel la ejecute como Serverless Function
export default app;
