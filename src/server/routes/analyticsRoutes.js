// routes/analyticsRoutes.js
import express from 'express';
import { protect, adminOnly } from './authRoutes.js'; 
import Dashboard from '../models/dashboardModel.js';
import Insight from '../models/insightModel.js';

const router = express.Router();// --- Endpoints de Dados e Análise ---

// === rotas de dashboard ===

// @route   POST /api/analytics/dashboard
// @desc    admin cria novo dashboard
// @access  Private/Admin
router.post('/dashboard', protect, adminOnly, async (req, res) => {
    try {
        const { title, description, data } = req.body;
        
        const newDashboard = await Dashboard.create({
            title,
            description,
            data,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            message: 'Dashboard criado com sucesso',
            dashboard: newDashboard
        });
    } catch (error) {
        console.error('Erro ao criar dashboard:', error.message);
        res.status(400).json({ 
            message: 'Erro ao criar dashboard', 
            error: error.message 
        });
    }
});

// @route   PUT /api/analytics/dashboard/:id
// @desc    admin atualiza dashboard
// @access  Private/Admin
router.put('/dashboard/:id', protect, adminOnly, async (req, res) => {
    try {
        const dashboard = await Dashboard.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard não encontrado' });
        }
        
        res.json({
            message: 'Dashboard atualizado',
            dashboard
        });
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar dashboard' });
    }
});

// @route   DELETE /api/analytics/dashboard/:id
// @desc    admin deleta dashboard
// @access  Private/Admin
router.delete('/dashboard/:id', protect, adminOnly, async (req, res) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id);
        
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard não encontrado' });
        }
        
        await Dashboard.findByIdAndDelete(req.params.id);
        
        res.json({
            message: 'Dashboard excluído com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir dashboard:', error.message);
        res.status(400).json({ 
            message: 'Erro ao excluir dashboard', 
            error: error.message 
        });
    }
});

// @route   GET /api/analytics/dashboard
// @desc    lista todos os dashboards ativos
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const dashboards = await Dashboard.find({ isActive: true })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            message: 'Dashboards carregados',
            count: dashboards.length,
            dashboards
        });
    } catch (error) {
        console.error('Erro ao buscar dashboards:', error.message);
        res.status(500).json({ message: 'Erro ao buscar dashboards' });
    }
});

// @route   GET /api/analytics/dashboard/:id
// @desc    busca dashboard especifico
// @access  Private
router.get('/dashboard/:id', protect, async (req, res) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id)
            .populate('createdBy', 'name');
            
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard não encontrado' });
        }
        
        res.json(dashboard);
    } catch (error) {
        console.error('Erro ao buscar dashboard:', error.message);
        res.status(500).json({ message: 'Erro ao buscar dashboard' });
    }
});

// === ROTAS DE INSIGHTS ===

// @route   POST /api/analytics/insights
// @desc    admin cria novo insight (action item)
// @access  Private/Admin
router.post('/insights', protect, adminOnly, async (req, res) => {
    try {
        const { title, content, type, priority, dashboardId } = req.body;
        
        const newInsight = await Insight.create({
            title,
            content,
            type,
            priority,
            dashboardId,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            message: 'Insight criado com sucesso',
            insight: newInsight
        });
    } catch (error) {
        console.error('Erro ao criar insight:', error.message);
        res.status(400).json({ 
            message: 'Erro ao criar insight', 
            error: error.message 
        });
    }
});

// @route   GET /api/analytics/insights
// @desc    lista todos os insights ativos
// @access  Private
router.get('/insights', protect, async (req, res) => {
    try {
        const insights = await Insight.find({ isActive: true })
            .populate('createdBy', 'name')
            .populate('dashboardId', 'title')
            .sort({ priority: -1, createdAt: -1 });

        res.json({
            message: 'Insights carregados',
            count: insights.length,
            insights
        });
    } catch (error) {
        console.error('Erro ao buscar insights:', error.message);
        res.status(500).json({ message: 'Erro ao buscar insights' });
    }
});

// @route   PUT /api/analytics/insights/:id
// @desc    admin atualiza insight
// @access  Private/Admin
router.put('/insights/:id', protect, adminOnly, async (req, res) => {
    try {
        const insight = await Insight.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!insight) {
            return res.status(404).json({ message: 'Insight não encontrado' });
        }
        
        res.json({
            message: 'Insight atualizado',
            insight
        });
    } catch (error) {
        console.error('Erro ao atualizar insight:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar insight' });
    }
});

// @route   DELETE /api/analytics/insights/:id
// @desc    admin remove insight
// @access  Private/Admin
router.delete('/insights/:id', protect, adminOnly, async (req, res) => {
    try {
        const insight = await Insight.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!insight) {
            return res.status(404).json({ message: 'Insight não encontrado' });
        }
        
        res.json({ message: 'Insight removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover insight:', error.message);
        res.status(500).json({ message: 'Erro ao remover insight' });
    }
});

// @route   POST /api/analytics/predict
// @desc    realiza predicao em tempo real (estrategia online)
// @access  Private
router.post('/predict', protect, async (req, res) => {
    // 1. O backend Node.js recebe os 18 atributos do frontend
    const patientData = req.body; 

    try {
        // 2. O Node.js FAZ UMA REQUISIÇÃO EXTERNA para sua API Python/Colab (proxy)
        // OBS: Você precisará da biblioteca 'axios' (npm install axios)
        // const axios = require('axios');
        
        // Exemplo de requisição para o servidor Python
        // const predictionResponse = await axios.post(process.env.ML_API_URL + '/predict', patientData);
        // const result = predictionResponse.data; 

        // Placeholder para simular a resposta do modelo
        const result = {
             prediction: Math.random() > 0.5 ? 1 : 0, // 1 ou 0
             probability: 0.85
        };

        // 3. Retorna o resultado da predição para o frontend
        // Usando patientData no log para evitar warning
        console.log('Dados do paciente recebidos:', Object.keys(patientData).length, 'atributos');
        
        res.json({
            message: 'Predição recebida com sucesso',
            result,
        });

    } catch (error) {
        console.error('Erro na predição:', error.message);
        res.status(500).json({ message: 'Erro simulado ao comunicar com o servidor ML' });
    }
});

// @route   POST /api/analytics/insights
// @desc    admin insere insights processados (ex: do google colab)
// @access  Private/Admin
router.post('/insights', protect, adminOnly, async (req, res) => {
    try {
        const newInsight = await Insight.create({
            ...req.body,
            uploadedBy: req.user._id,
            metadata: {
                ...req.body.metadata,
                processedAt: new Date()
            }
        });

        res.status(201).json({
            message: 'Insight salvo com sucesso',
            insight: newInsight
        });
    } catch (error) {
        console.error('Erro ao salvar insight:', error.message);
        res.status(400).json({ message: 'Erro ao salvar insight' });
    }
});

// @route   GET /api/analytics/insights/:category
// @desc    Obtém insights por categoria
// @access  Private
router.get('/insights/:category', protect, async (req, res) => {
    try {
        const { category } = req.params;
        const insights = await Insight.find({ 
            category, 
            isPublic: true 
        }).sort({ 'metadata.processedAt': -1 });

        res.json({
            category,
            count: insights.length,
            insights
        });
    } catch (error) {
        console.error('Erro ao buscar insights:', error.message);
        res.status(500).json({ message: 'Erro ao buscar insights' });
    }
});

// @route   GET /api/analytics/insights
// @desc    Lista todos os insights disponíveis
// @access  Private
router.get('/insights', protect, async (req, res) => {
    try {
        const insights = await Insight.find({ isPublic: true })
            .sort({ 'metadata.processedAt': -1 })
            .limit(50); // Limita para performance

        // Agrupa por categoria
        const groupedInsights = insights.reduce((acc, insight) => {
            if (!acc[insight.category]) {
                acc[insight.category] = [];
            }
            acc[insight.category].push(insight);
            return acc;
        }, {});

        res.json({
            totalInsights: insights.length,
            categories: Object.keys(groupedInsights),
            insights: groupedInsights,
            lastUpdate: insights[0]?.metadata.processedAt
        });
    } catch (error) {
        console.error('Erro ao listar insights:', error.message);
        res.status(500).json({ message: 'Erro ao listar insights' });
    }
});

// @route   POST /api/analytics/generate-sample-dashboard
// @desc    Gera dashboard com dados cardiovasculares falsos
// @access  Private/Admin
router.post('/generate-sample-dashboard', protect, adminOnly, async (req, res) => {
  try {
    const sampleData = {
      title: 'Dashboard Cardiovascular - Hospital Central',
      description: 'Análise de condições cardiovasculares dos pacientes',
      cardiovascularData: {
        totalPatients: 1250,
        ageGroups: {
          under30: 180,
          between30_50: 520,
          above50: 550
        },
        conditions: {
          hypertension: 450, // 36%
          diabetes: 280, // 22.4%
          heartDisease: 125, // 10%
          stroke: 85, // 6.8%
          obesity: 375 // 30%
        },
        riskFactors: {
          smoking: 225, // 18%
          sedentary: 650, // 52%
          highCholesterol: 400, // 32%
          familyHistory: 300 // 24%
        },
        monthlyTrends: [
          { month: 'Jan', newCases: 45, recoveries: 32 },
          { month: 'Fev', newCases: 52, recoveries: 38 },
          { month: 'Mar', newCases: 48, recoveries: 41 },
          { month: 'Abr', newCases: 65, recoveries: 35 },
          { month: 'Mai', newCases: 58, recoveries: 42 },
          { month: 'Jun', newCases: 71, recoveries: 39 }
        ]
      },
      createdBy: req.user._id
    };

    const dashboard = await Dashboard.create(sampleData);

    // Gerar insights automáticos
    const insightData1 = {
      title: 'Alto Índice de Hipertensão em Idosos',
      content: 'Pacientes acima de 50 anos representam 82% dos casos de hipertensão. Necessário intensificar campanhas de prevenção.',
      type: 'warning',
      priority: 'high',
      medicalData: {
        condition: 'hypertension',
        affectedGroup: 'Pacientes acima de 50 anos',
        percentage: 82,
        trend: 'increasing'
      },
      actionItems: [
        {
          action: 'Implementar programa de monitoramento domiciliar',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          responsible: 'Equipe de Cardiologia',
          category: 'prevention'
        },
        {
          action: 'Criar campanhas educativas sobre hipertensão',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
          responsible: 'Marketing Hospitalar',
          category: 'education'
        }
      ],
      dashboardId: dashboard._id,
      createdBy: req.user._id
    };

    const insightData2 = {
      title: 'Sedentarismo Crítico - Ação Imediata',
      content: '52% dos pacientes apresentam estilo de vida sedentário, principal fator de risco cardiovascular.',
      type: 'prevention',
      priority: 'urgent',
      medicalData: {
        condition: 'general',
        affectedGroup: 'Pacientes de todas as idades',
        percentage: 52,
        trend: 'increasing'
      },
      actionItems: [
        {
          action: 'Programa de exercícios supervisionados',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          responsible: 'Fisioterapia',
          category: 'treatment'
        }
      ],
      dashboardId: dashboard._id,
      createdBy: req.user._id
    };

    const insight1 = await Insight.create(insightData1);
    const insight2 = await Insight.create(insightData2);

    res.status(201).json({
      message: 'Dashboard cardiovascular gerado com sucesso!',
      dashboard,
      insights: [insight1, insight2],
      summary: {
        totalPatients: 1250,
        mainConditions: {
          hypertension: '36%',
          sedentarismo: '52%',
          obesity: '30%'
        },
        recommendation: 'Focar em prevenção para pacientes 50+ anos'
      }
    });
  } catch (error) {
    console.error('Erro ao gerar dashboard:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;