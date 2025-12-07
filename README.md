# Heartbeat Insights

## Tópicos Avançados em Programação III - Desenvolvimento Web
- Professor: Muriel Franco
- Alunas: Emilie Kim, Leticia Godoi e Mariana Luisa Gonçalves

## Visão Geral
> Plataforma completa para análises cardiovasculares com dashboards interativos, insights médicos e visualizações personalizadas.

O **Heartbeat Insights** é uma aplicação web moderna que permite profissionais de saúde criar, gerenciar e visualizar dashboards cardiovasculares personalizados. A plataforma combina um backend robusto em Node.js com um frontend React, oferecendo visualizações de dados através de gráficos interativos e um sistema completo de gerenciamento de insights médicos.

## Arquitetura da Aplicação

```
React Frontend → API Node.js → MongoDB → APIs Externas
```

### **Backend Node.js**
- API REST completa com autenticação JWT
- Gerenciamento de usuários com controle de acesso (user/admin)
- CRUD completo para dashboards e insights
- Integração com API externa (Advice Slip API)
- Estrutura modular: routes, models, services

### **Banco de Dados (MongoDB)**
- **3 Collections principais**: Users, Dashboards, Insights
- **Dados Estruturados**: Esquemas específicos para cada tipo de informação
- **Flexibilidade**: Suporte a dados JSON customizados

### **Frontend**
- Single Page Application (SPA) com React Router
- Autenticação com Context API e localStorage
- Visualizações com Chart.js
- Suporte a 5 tipos de gráficos
- Design responsivo com CSS moderno

## Funcionalidades Principais

- **Dashboards Customizados**: Criação de gráficos via JSON (pie, bar, line, doughnut, scatter)
- **Sistema de Insights**: Insights médicos com prioridades e vinculação a dashboards
- **Relacionamentos**: Navegação entre insights e dashboards relacionados
- **Autenticação Completa**: Login/Registro com JWT e controle de acesso por roles
- **Gerenciamento de Usuários**: Admins podem criar, editar e excluir usuários
- **Conselhos de Saúde**: Integração com API externa para conselhos motivacionais

## Stack

### Backend
- **Node.js 18+** + **Express.js** - API REST moderna
- **MongoDB** + **Mongoose** - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre domínios
- **ES Modules** - Padrão JavaScript moderno

### Frontend
- **React 19** - Biblioteca UI moderna
- **React Router DOM 6** - Navegação SPA
- **Vite 7** - Build tool rápido e otimizado
- **Chart.js** - Gráficos interativos
- **Context API** - Gerenciamento de estado global

### Banco de Dados (MongoDB)
- **3 Collections Principais**:
  - `users` - Gerenciamento de usuários e autenticação
  - `dashboards` - Dashboards cardiovasculares e gráficos personalizados
  - `insights` - Insights médicos e action items

## 📁 Estrutura do Projeto

```
heartbeat-insights/
├── src/
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── AppLayout.jsx        # Layout principal com header
│   │   ├── ChartModal.jsx       # Modal para exibir gráficos
│   │   ├── Navigation.jsx       # Menu de navegação
│   │   └── SkeletonLoader.jsx   # Esqueleto para loading
│   ├── contexts/
│   │   └── AuthContext.jsx      # Context API para autenticação
│   ├── pages/                   # Páginas da aplicação
│   │   ├── DashboardPage.jsx    # Listagem e criação de dashboards
│   │   ├── InsightsPage.jsx     # Gerenciamento de insights
│   │   ├── UsersPage.jsx        # Administração de usuários (admin)
│   │   └── LoginPage.jsx        # Autenticação
│   ├── server/                  # Backend Node.js
│   │   ├── models/
│   │   │   ├── userModel.js     # Schema de usuários
│   │   │   ├── dashboardModel.js # Schema de dashboards
│   │   │   └── insightModel.js  # Schema de insights
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Autenticação e usuários
│   │   │   └── analyticsRoutes.js # Dashboards e insights
│   │   ├── services/
│   │   │   └── adviceService.js # Integração Advice Slip API
│   │   └── index.js             # Servidor Express
│   ├── styles/                  # CSS modularizado
│   │   ├── global.css           # Estilos globais e variáveis
│   │   ├── modal.css            # Estilos compartilhados de modais
│   │   ├── dashboard.css        # Estilos de dashboards
│   │   └── ...
│   ├── utils/
│   │   └── chartExamples.js     # Templates de gráficos
│   ├── api.js                   # Helper centralizado de API
│   ├── App.jsx                  # Componente raiz
│   └── main.jsx                 # Entry point React
├── api/
│   └── index.js                 
├── front/                       # Versão HTML legada (não em uso)
├── package.json                 # Dependências e scripts
└── README.md                    # Documentação
```

## 📊 Modelos de Dados

### 👤 **User Model** (`userModel.js`)
Gerencia autenticação e controle de acesso:

```javascript
{
  _id: ObjectId("6921fefa4dfeb613873e35dd"),
  name: "Dr. João Silva",
  email: "joao.silva@hospital.com",
  password: "$2a$10$...", // bcrypt hash
  role: "admin", // 'user' ou 'admin'
  createdAt: "2025-11-22T18:45:30.123Z",
  updatedAt: "2025-11-22T18:45:30.123Z"
}
```

### 🫀 **Dashboard Model** (`dashboardModel.js`)
Armazena dashboards cardiovasculares e gráficos personalizados:

```javascript
{
  _id: ObjectId("692206fbea8f2670e7d4d053"),
  title: "Análise de Comorbidades",
  description: "Distribuição de comorbidades por faixa etária",
  
  // dados cardiovasculares estruturados (para gráficos pré-definidos)
  cardiovascularData: {
    totalPatients: 1250,
    ageGroups: { under30: 320, between30_50: 580, above50: 350 },
    conditions: { 
      hypertension: 450, diabetes: 280, heartDisease: 150,
      stroke: 85, obesity: 520 
    },
    riskFactors: { 
      smoking: 380, sedentary: 680, highCholesterol: 290,
      familyHistory: 210 
    },
    monthlyTrends: [
      { month: "Janeiro", newCases: 45, recoveries: 38 },
      { month: "Fevereiro", newCases: 52, recoveries: 41 }
    ]
  },
  
  // dados personalizados (para gráficos customizados)
  data: {
    chartType: "pie",
    labels: ["Hipertensão", "Arritmia", "Saudáveis"],
    values: [450, 280, 520]
  },
  
  isActive: true,
  createdBy: ObjectId("6921fefa4dfeb613873e35dd"),
  createdAt: "2025-11-22T18:54:51.121Z",
  updatedAt: "2025-11-22T18:54:51.121Z"
}
```

### 💡 **Insight Model** (`insightModel.js`)  
Gerencia insights médicos e action items:

```javascript
{
  _id: ObjectId("69220845ea8f2670e7d4d060"),
  title: "Aumento de Hipertensão em Jovens",
  content: "Observado crescimento de 15% nos casos de hipertensão em pacientes entre 25-35 anos",
  type: "warning", // 'action', 'warning', 'info', 'success', 'prevention', 'medical'
  priority: "high", // 'low', 'medium', 'high', 'urgent', 'critical'
  
  medicalData: {
    condition: "hypertension",
    affectedGroup: "Adultos jovens (25-35 anos)",
    percentage: 15.3,
    trend: "increasing"
  },
  
  actionItems: [
    {
      action: "Implementar programa de prevenção cardiovascular",
      deadline: "2025-12-31T00:00:00.000Z",
      responsible: "Equipe de Cardiologia",
      status: "pending"
    }
  ],
  
  isActive: true,
  createdBy: ObjectId("6921fefa4dfeb613873e35dd"),
  createdAt: "2025-11-22T19:02:15.456Z"
}
```

## 🛣️ Rotas da API

### **Autenticação** (`authRoutes.js`)
```http
POST /api/auth/register           # Criar novo usuário
POST /api/auth/login              # Autenticar usuário (retorna JWT)
GET    /api/auth/users              # Listar usuários (admin only)
PUT    /api/auth/users/:id          # Editar usuário (admin only)
DELETE /api/auth/users/:id          # Excluir usuário (admin only)
```

### **Dashboards** (`analyticsRoutes.js`)
```http
GET    /api/analytics/dashboard        # Listar todos os dashboards
POST   /api/analytics/dashboard        # Criar dashboard (admin only)
GET    /api/analytics/dashboard/:id    # Buscar dashboard específico
PUT    /api/analytics/dashboard/:id    # Atualizar dashboard (admin only)
DELETE /api/analytics/dashboard/:id    # Excluir dashboard (admin only)
POST   /api/analytics/generate-sample-dashboard  # Gerar dados de exemplo
```

### **Insights** (`analyticsRoutes.js`)
```http
GET    /api/analytics/insights         # Listar todos os insights
POST   /api/analytics/insights         # Criar insight (admin only)
PUT    /api/analytics/insights/:id     # Atualizar insight (admin only)
DELETE /api/analytics/insights/:id     # Excluir insight (admin only)
```

### **Serviços Externos** (`analyticsRoutes.js`)
```http
GET    /api/analytics/health-advice    # Buscar conselho aleatório (Advice Slip API)
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB 6+
- NPM ou Yarn
- Conta MongoDB Atlas

### 1. Clone o repositório
```bash
git clone https://github.com/leticiagdi/heartbeat-insights.git
cd heartbeat-insights
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):
```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/heartbeat-insights

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui_minimo_32_caracteres

# Server
PORT=5001
NODE_ENV=development
```

⚠️ **IMPORTANTE:** O `JWT_SECRET` é obrigatório. O sistema não inicializa sem ele.

### 4. Inicie a aplicação

#### Desenvolvimento (Frontend + Backend juntos)
```bash
npm start
# Frontend: http://localhost:5173
# Backend: http://localhost:5001
```

#### Apenas Backend
```bash
npm run server
# API: http://localhost:5001
```

#### Apenas Frontend (React)
```bash
npm run dev
# Vite dev server: http://localhost:5173
```

#### Build para produção
```bash
npm run build
# Gera pasta dist/ com arquivos otimizados
```

## 🧪 Exemplos Práticos de Uso

### **Criando um Usuário**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. João Silva",
    "email": "joao.silva@hospital.com",
    "password": "senha123"
  }'
# Nota: Sempre cria como role: 'user' por segurança
# Admins podem promover usuários via PUT /api/auth/users/:id
```

### **Fazendo Login**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@hospital.com",
    "password": "senha123"
  }'

# Resposta:
{
  "_id": "6921fefa4dfeb613873e35dd",
  "name": "Dr. João Silva",
  "email": "joao.silva@hospital.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Criando Dashboard com Gráfico**
```bash
curl -X POST http://localhost:5001/api/analytics/dashboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Distribuição de Pacientes por Idade",
    "description": "Análise demográfica dos pacientes cardiovasculares",
    "data": {
      "chartType": "pie",
      "title": "Faixas Etárias",
      "labels": ["18-30", "31-50", "51-70", "70+"],
      "values": [120, 340, 450, 90]
    }
  }'
```

**Tipos de gráfico suportados:**
- `pie` - Gráfico de pizza
- `doughnut` - Gráfico de rosca
- `bar` - Gráfico de barras
- `line` - Gráfico de linha
- `scatter` - Gráfico de dispersão (com grupos)

### **Criando Insight Médico (com dashboard relacionado)**
```bash
curl -X POST http://localhost:5001/api/analytics/insights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Aumento de Hipertensão em Jovens",
    "content": "Observado crescimento de 15% nos casos de hipertensão em pacientes entre 25-35 anos",
    "type": "warning",
    "priority": "high",
    "dashboardId": "692206fbea8f2670e7d4d053"
  }'
```

**Tipos de insight:** `info`, `action`, `warning`, `success`
**Prioridades:** `low`, `medium`, `high`, `urgent`

## Funcionalidades da Interface

### **Dashboard Principal**
- **Visualização em Tempo Real**: Gráficos atualizados dinamicamente
- **Containers Separados**: Gráficos cardiovasculares vs personalizados
- **Navegação Intuitiva**: Seções organizadas (Dashboard, Insights)

### **Criação de Gráficos**
- **Interface Visual**: Criação intuitiva com preview em tempo real
- **Tipos Suportados**: Pizza, Barras, Linha, Rosquinha
- **Entrada JSON**: Para dados complexos e estruturas customizadas

### **Sistema de Insights**
- **Action Items**: Insights com prioridades e prazos
- **Dados Médicos**: Informações específicas sobre condições
- **Responsabilidades**: Atribuição de tarefas para equipes

### **Validação JSON Inteligente**
- **Validação em Tempo Real**: Feedback visual instantâneo durante digitação
- **Placeholder Educativo**: Exemplos práticos e lista de erros comuns
- **Feedback Visual**: Bordas coloridas (verde=válido, vermelho=inválido)
- **Tooltips Específicos**: Mensagens contextuais baseadas no tipo de erro
- **Prevenção de Erros**: Detecta aspas simples, vírgulas extras, chaves não fechadas
</div>
