// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import User from '../models/UserModel.js';

const router = express.Router();

// Gera um JSON Web Token (JWT)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d', 
    });
};

// Middleware de Proteção de Rotas (verifica o token)
const protect = async (req, res, next) => {
    try {
        // Busca token no header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token não encontrado' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Busca o usuário pelo ID
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }
        
        // Anexa o usuário à requisição
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Erro na autenticação:', error.message);
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar se é admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
};

// --- Endpoints de Autenticação ---

// @route   POST /api/auth/register
// @desc    Registrar novo usuário (admin pode definir role)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;
        
        // Verifica se usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria novo usuário
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            role: role // 'user' ou 'admin'
        });
        
        res.status(201).json({ 
            message: 'Usuário criado com sucesso',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id) 
        });
    } catch (error) {
        console.error('Erro no registro:', error.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca usuário por email
        const user = await User.findOne({ email });
        
        // Verifica se usuário existe e senha está correta
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                token: generateToken(user._id) 
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});



// Exporta o router e os middlewares
export { protect, adminOnly };
export default router;