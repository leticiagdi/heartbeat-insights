// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'node:process';
import cors from 'cors';

// importa o router de autenticacao (export default)
import authRoutes from './routes/authRoutes.js'; 
// correcao: o arquivo se chama 'analyticsRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js';

 
// carrega as variaveis de ambiente
dotenv.config();

const app = express();

// --- 1. conexao com o mongodb (melhorado com async/await) ---
// const connectDB = async () => {
//     try {
//         const DB_URL = process.env.MONGO_URI; // Usando MONGO_URI, um padrão mais comum
//         if (!DB_URL) {
//             throw new Error("Variável MONGO_URI não está definida no arquivo .env");
//         }
//         console.log("URI sendo usada (parte inicial):", DB_URL.substring(0, 50) + "...");
//         const conn = await mongoose.connect(DB_URL);
//         console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
//         // encerra a aplicacao se o db nao conectar
//         process.exit(1); 
//     }
// };
// index.js (Bloco connectDB)
// index.js (Bloco connectDB)
// index.js (Bloco connectDB)
const connectDB = async () => {
    try {
        const DB_URL = process.env.MONGO_URI; 
        // ...
        const conn = await mongoose.connect(DB_URL, {
            serverSelectionTimeoutMS: 5000, 
            // ssl: true, <-- REMOVA ESTA OPÇÃO PARA O TESTE
        });

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1); 
    }
};


// inicia a conexao
connectDB(); 

// --- 2. middlewares ---
app.use(cors()); // Permite requisições de outras origens (frontend)
app.use(express.json()); // Para parsear o body das requisições como JSON

// --- 3. rotas da aplicacao ---
// rota de autenticacao
app.use('/api/auth', authRoutes);

// rota de analise e dados
app.use('/api/analytics', analyticsRoutes); 


// rota principal/teste
app.get('/', (req, res) => {
    res.send('API Heartbeat Insights está online e rodando!');
});




// --- 4. inicializacao do servidor ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando na porta http://localhost:${PORT}`);
});