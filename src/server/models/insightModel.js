// models/insightModel.js
import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema({
  // Título do insight
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Conteúdo do insight (action item)
  content: {
    type: String,
    required: true
  },
  
  // Tipo/categoria do insight
  type: {
    type: String,
    enum: ['action', 'warning', 'info', 'success', 'prevention', 'medical'],
    default: 'info'
  },
  
  // Prioridade
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent', 'critical'],
    default: 'medium'
  },
  
  // Dados médicos específicos
  medicalData: {
    condition: {
      type: String,
      enum: ['hypertension', 'diabetes', 'heartDisease', 'stroke', 'obesity', 'general']
    },
    affectedGroup: String, // ex: "Pacientes acima de 50 anos"
    percentage: Number, // porcentagem dos pacientes afetados
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    }
  },
  
  // Ações recomendadas
  actionItems: [{
    action: String,
    deadline: Date,
    responsible: String,
    category: {
      type: String,
      enum: ['prevention', 'treatment', 'monitoring', 'education']
    }
  }],
  
  // Status do insight
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Dashboard relacionado (opcional)
  dashboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard',
    required: false
  },
  
  // Quem criou (admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, {
  timestamps: true
});

export default mongoose.model('Insight', InsightSchema);