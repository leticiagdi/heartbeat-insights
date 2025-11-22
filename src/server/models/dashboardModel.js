// models/dashboardModel.js
import mongoose from 'mongoose';

const DashboardSchema = new mongoose.Schema({
  // informacoes basicas
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // dados cardiovasculares estruturados
  cardiovascularData: {
    totalPatients: { type: Number, default: 0 },
    ageGroups: {
      under30: { type: Number, default: 0 },
      between30_50: { type: Number, default: 0 },
      above50: { type: Number, default: 0 }
    },
    conditions: {
      hypertension: { type: Number, default: 0 },
      diabetes: { type: Number, default: 0 },
      heartDisease: { type: Number, default: 0 },
      stroke: { type: Number, default: 0 },
      obesity: { type: Number, default: 0 }
    },
    riskFactors: {
      smoking: { type: Number, default: 0 },
      sedentary: { type: Number, default: 0 },
      highCholesterol: { type: Number, default: 0 },
      familyHistory: { type: Number, default: 0 }
    },
    monthlyTrends: [{
      month: String,
      newCases: Number,
      recoveries: Number
    }]
  },
  
  // dados legados (manter compatibilidade)
  data: {
    type: mongoose.Schema.Types.Mixed, // JSON flexível
    required: false
  },
  
  // status do dashboard
  isActive: {
    type: Boolean,
    default: true
  },
  
  // quem criou (admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, {
  timestamps: true
});

export default mongoose.model('Dashboard', DashboardSchema);