import cors from 'cors';

const allowedOrigins = [
  'https://osteuslivrosangular-production.up.railway.app', // Frontend de railway
  'https://osteuslivrosangular.onrender.com', // Frontend de render.com
  'http://localhost:4210',
  'http://localhost:4211',  // Para Java
  'http://localhost:4230',
  'http://localhost:5002'   // Para as chamdas dende o swagger (OpenApi)
];

const corsMiddleware = () => cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' (como Postman o móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      return callback(null, true);
    } else {
      console.warn('⚠ Origem bloqueado polas CORS:', origin);
      return callback(new Error('Origem nom permitido'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'rolroleiro', 'usuarinho',
    'Cache-Control', 'Pragma', 'Expires'       // os engadim no front para que as petiçons de GET nom as cachee o navegador
  ],
  exposedHeaders: ['rolroleiro', 'usuarinho'], // Headers personalizados
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
});

// Manejo explícito de OPTIONS para todas las rutas
//app.options('*', cors());

export default corsMiddleware;