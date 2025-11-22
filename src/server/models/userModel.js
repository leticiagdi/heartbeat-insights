// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que não haja emails duplicados
  },
  password: {
    type: String,
    required: true,
  },
  // O campo 'role' é crucial para o controle de acesso (Administradores inserem novos dados)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Opcional: Para rastrear a criação e atualização do registro
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Adiciona campos 'createdAt' e 'updatedAt' automaticamente
  timestamps: true, 
});

export default mongoose.model('User', UserSchema);