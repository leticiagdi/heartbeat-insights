import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Configurar encoding UTF-8 para todas as respostas
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// Servir arquivos estáticos da pasta front com UTF-8
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    }
}));

// Rota para servir o index.html com UTF-8
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎨 Frontend rodando em http://localhost:${PORT}`);
    console.log('📱 Acesse http://localhost:3000 no seu navegador');
    console.log('🔤 Encoding UTF-8 configurado');
});