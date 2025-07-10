
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'https://guardianova-backend-api-865832184036.us-west1.run.app/api';

// Proxy para las llamadas a la API
if (BACKEND_URL) {
  app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // Opcional: reescribe la ruta si tu backend no espera /api
  }));
  console.log(`Proxying API requests to: ${BACKEND_URL}`);
} else {
  // This is now unreachable given the fallback above, but good practice to keep.
  console.warn('BACKEND_URL environment variable not set. API calls will not be proxied.');
}

const buildPath = path.join(__dirname, 'build');

// Servir archivos estáticos desde el directorio 'build'
app.use(express.static(buildPath));

// Para cualquier otra petición, servir el index.html
// Esto es clave para que las aplicaciones de página única (SPA) funcionen correctamente.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// Configurar CORS
app.use(cors({
  origin: 'https://guard-iac.vercel.app', // o '*' para pruebas
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
