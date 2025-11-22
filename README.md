# 💓 Heartbeat Insights

> Plataforma completa para análises cardiovasculares com dashboards interativos, insights médicos e visualizações personalizadas.

## 🎯 Visão Geral

O **Heartbeat Insights** é uma aplicação web moderna que permite profissionais de saúde criar, gerenciar e visualizar dashboards cardiovasculares personalizados. A plataforma oferece tanto gráficos pré-definidos para análises padrão quanto ferramentas para criação de visualizações completamente customizadas.

## 🏗️ Arquitetura da Aplicação

```
🫀 Dados Cardiovasculares → 📊 API Node.js → 💾 MongoDB → 🎨 Frontend Dinâmico
```

### 🚀 **Backend Node.js**
- API REST completa com autenticação JWT
- Gerenciamento de usuários com controle de acesso (user/admin)
- CRUD completo para dashboards e insights
- Estrutura modular com routes e models separados

### 📊 **Banco MongoDB**
- **3 Collections principais**: Users, Dashboards, Insights
- **Dados Estruturados**: Esquemas específicos para cada tipo de informação
- **Flexibilidade**: Suporte a dados JSON customizados

### ⚡ **Frontend Interativo**
- Interface HTML/CSS/JavaScript pura
- Chart.js para visualizações dinâmicas
- Modais para criação de conteúdo
- Dashboards personalizados com containers separados

## ✨ Funcionalidades Principais

- **🎨 Criação de Gráficos**: Interface visual intuitiva para gráficos personalizados
- **📝 Dashboards JSON**: Entrada manual de dados complexos para usuários técnicos
- **🫀 Análises Cardiovasculares**: Gráficos pré-definidos (faixa etária, condições, fatores de risco)
- **💡 Sistema de Insights**: Criação e gerenciamento de ações médicas
- **🔐 Controle de Acesso**: Usuários e administradores com permissões diferentes
- **📱 Interface Responsiva**: Funciona perfeitamente em desktop e dispositivos móveis

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 18+** + **Express.js** - API REST moderna
- **MongoDB** + **Mongoose** - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre domínios
- **ES Modules** - Padrão JavaScript moderno

### Frontend
- **HTML5** + **CSS3** - Estrutura e estilização
- **JavaScript Vanilla** - Lógica e interatividade
- **Chart.js** - Gráficos dinâmicos e responsivos
- **CSS Grid/Flexbox** - Layout moderno
- **Modals** - Interface de usuário intuitiva

### Banco de Dados
- **3 Collections Principais**:
  - `users` - Gerenciamento de usuários e autenticação
  - `dashboards` - Dashboards cardiovasculares e gráficos personalizados
  - `insights` - Insights médicos e action items

## 📁 Estrutura do Projeto

```
heartbeat-insights/
├── src/server/
│   ├── models/
│   │   ├── userModel.js         # Schema de usuários (user/admin)
│   │   ├── dashboardModel.js    # Schema de dashboards cardiovasculares
│   │   └── insightModel.js      # Schema de insights médicos
│   ├── routes/
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   └── analyticsRoutes.js   # Rotas de dashboards e insights
│   └── index.js                 # Servidor Express principal
├── front/
│   ├── index.html               # Interface principal
│   ├── script.js                # Lógica da aplicação
│   ├── custom-charts.js         # Criação de gráficos personalizados
│   └── style.css                # Estilização da interface
├── public/                      # Arquivos estáticos
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
POST /api/auth/register  # Criar novo usuário
POST /api/auth/login     # Autenticar usuário
```

### **Analytics** (`analyticsRoutes.js`)
```http
# Dashboards
GET    /api/analytics/dashboards        # Listar todos os dashboards
POST   /api/analytics/dashboard         # Criar novo dashboard
GET    /api/analytics/dashboard/:id     # Buscar dashboard específico
PUT    /api/analytics/dashboard/:id     # Atualizar dashboard
DELETE /api/analytics/dashboard/:id     # Excluir dashboard

# Insights
GET    /api/analytics/insights          # Listar insights
POST   /api/analytics/insights          # Criar insight (admin)
PUT    /api/analytics/insights/:id      # Atualizar insight (admin)
DELETE /api/analytics/insights/:id      # Excluir insight (admin)
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB 6+
- NPM ou Yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/heartbeat-insights.git
cd heartbeat-insights
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Database
MONGO_URI=mongodb://localhost:27017/heartbeat-insights

# Server  
PORT=5000

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# CORS
CLIENT_URL=http://localhost:3000
```

### 4. Inicie os serviços

#### Backend
```bash
npm run start       # Servidor completo
# ou
npm run server      # Apenas API
```

#### Frontend
Abra o `front/index.html` em seu navegador ou use um servidor local:
```bash
# Usando Python (se disponível)
cd front
python -m http.server 3000

# Usando Node.js (serve)
npx serve front -p 3000
```

## 🧪 Exemplos Práticos de Uso

### **Criando um Usuário Administrador**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. João Silva",
    "email": "joao.silva@hospital.com", 
    "password": "senha123",
    "role": "admin"
  }'
```

### **Fazendo Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@hospital.com",
    "password": "senha123"
  }'

# Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6921fefa4dfeb613873e35dd",
    "name": "Dr. João Silva",
    "email": "joao.silva@hospital.com",
    "role": "admin"
  }
}
```

### **Criando Dashboard com Dados Cardiovasculares**
```bash
curl -X POST http://localhost:5000/api/analytics/dashboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Óbitos por Cidade",
    "description": "Análise de mortalidade cardiovascular por região",
    "cardiovascularData": {
      "totalPatients": 1250,
      "ageGroups": {
        "under30": 320,
        "between30_50": 580, 
        "above50": 350
      },
      "conditions": {
        "hypertension": 450,
        "diabetes": 280,
        "heartDisease": 150,
        "stroke": 85,
        "obesity": 520
      }
    }
  }'
```

### **Criando Gráfico Personalizado**
```bash
curl -X POST http://localhost:5000/api/analytics/dashboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Análise de Comorbidades",
    "description": "Distribuição de comorbidades por tipo",
    "data": {
      "chartType": "pie",
      "labels": ["Hipertensão", "Arritmia", "Saudáveis"],
      "values": [450, 280, 520]
    }
  }'
```

### **Dashboard JSON com Validação**
Na interface web, o campo JSON possui validação inteligente:

```json
// ✅ JSON Válido (borda verde)
{
  "hipertensos": 320,
  "diabeticos": 180,
  "obesos": 250,
  "total": 750
}

// ❌ Erros Comuns Detectados (borda vermelha + tooltip)
{hipertensos: 320}           → "Erro: Use aspas duplas"
{"hipertensos": 320,}        → "Erro: Vírgula extra no final"
{'campo': 123}               → "Erro: Use aspas duplas (\") não simples (')"
{"campo": valor}             → "Erro: Valores string precisam de aspas"
```

### **Criando Insight Médico**
```bash
curl -X POST http://localhost:5000/api/analytics/insights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Aumento de Hipertensão em Jovens",
    "content": "Observado crescimento de 15% nos casos de hipertensão em pacientes entre 25-35 anos",
    "type": "warning",
    "priority": "high",
    "medicalData": {
      "condition": "hypertension",
      "affectedGroup": "Adultos jovens (25-35 anos)",
      "percentage": 15.3,
      "trend": "increasing"
    }
  }'
```

## 🎯 Funcionalidades da Interface

### **Dashboard Principal**
- **Visualização em Tempo Real**: Gráficos atualizados dinamicamente
- **Containers Separados**: Gráficos cardiovasculares vs personalizados
- **Navegação Intuitiva**: Seções organizadas (Dashboard, Insights)

### **Criação de Gráficos**
- **🎨 Interface Visual**: Criação intuitiva com preview em tempo real
- **📊 Tipos Suportados**: Pizza, Barras, Linha, Rosquinha
- **📝 Entrada JSON**: Para dados complexos e estruturas customizadas
- **🔄 Edição Dinâmica**: Adicionar/remover pontos de dados facilmente

### **Sistema de Insights**
- **💡 Action Items**: Insights com prioridades e prazos
- **⚕️ Dados Médicos**: Informações específicas sobre condições
- **📈 Tendências**: Monitoramento de crescimento/declínio
- **👥 Responsabilidades**: Atribuição de tarefas para equipes

### **Validação JSON Inteligente**
- **🔍 Validação em Tempo Real**: Feedback visual instantâneo durante digitação
- **💡 Placeholder Educativo**: Exemplos práticos e lista de erros comuns
- **🎨 Feedback Visual**: Bordas coloridas (verde=válido, vermelho=inválido)
- **📋 Tooltips Específicos**: Mensagens contextuais baseadas no tipo de erro
- **⚡ Prevenção de Erros**: Detecta aspas simples, vírgulas extras, chaves não fechadas

## 🎯 Vantagens da Arquitetura Atual

### ⚡ **Performance Otimizada**
- **Frontend Leve**: JavaScript vanilla sem frameworks pesados
- **Carregamento Instantâneo**: Dados estruturados no MongoDB
- **Separação de Containers**: Evita conflitos entre visualizações
- **Chart.js**: Renderização eficiente de gráficos

### 🔧 **Flexibilidade de Dados**
- **Dual Structure**: Dados cardiovasculares estruturados + JSON livre
- **Compatibilidade**: Suporte a dashboards legados e novos formatos  
- **Escalabilidade**: Fácil adição de novos tipos de gráfico
- **API Restful**: Integração simples com sistemas externos

### 🛡️ **Segurança e Controle**
- **JWT Robusto**: Tokens seguros com expiração
- **Roles Diferenciados**: Usuários vs Administradores
- **CORS Configurado**: Controle de acesso entre domínios
- **Validação de Dados**: Mongoose schemas com validação

### 🧩 **Manutenibilidade**
- **Código Modular**: Models, Routes e Controllers separados
- **ES Modules**: Padrão JavaScript moderno
- **Comentários Padronizados**: Documentação inline consistente
- **Estrutura Clara**: Arquivos organizados por funcionalidade

### 🔍 **Validação JSON Avançada**
- **Parser em Tempo Real**: `JSON.parse()` com try/catch inteligente
- **Detecção de Padrões**: Identifica erros comuns (aspas, vírgulas, chaves)
- **Feedback Visual CSS**: Classes `.json-valid` e `.json-invalid`
- **Tooltips Contextuais**: Mensagens específicas baseadas no erro
- **UX Melhorada**: Reduz drasticamente erros de sintaxe JSON

## 🚦 Status Atual do Projeto

### ✅ **Completamente Funcionais**
- ✅ **API Backend**: Todas as rotas implementadas e testadas
- ✅ **Autenticação**: Sistema JWT completo com roles
- ✅ **Modelos de Dados**: Schemas otimizados para performance
- ✅ **Interface Web**: Frontend responsivo e intuitivo
- ✅ **Gráficos Dinâmicos**: Chart.js integrado e funcionando
- ✅ **CRUD Completo**: Dashboards e Insights totalmente gerenciáveis
- ✅ **Separação de Containers**: Visualizações organizadas
- ✅ **Validação JSON**: Sistema inteligente com feedback em tempo real

### 🔄 **Em Uso - Dados Reais**
```javascript
// Dashboards já cadastrados no sistema:
{
  "_id": "692206fbea8f2670e7d4d053",
  "title": "Análise de Comorbidades", 
  "description": "Descriçao",
  "createdBy": "6921fefa4dfeb613873e35dd"
},
{
  "_id": "69220737ea8f2670e7d4d059",
  "title": "Óbitos por cidade",
  "description": "Descriçao", 
  "createdBy": "6921fefa4dfeb613873e35dd"
}
```

## 📈 Roadmap Futuro

### 🎯 **Melhorias Planejadas**
- **📊 Mais Tipos de Gráfico**: Scatter, Radar, Gauge
- **🔄 Sync em Tempo Real**: WebSockets para atualizações live
- **📱 App Mobile**: Progressive Web App (PWA)
- **🤖 Integração ML**: APIs para modelos preditivos
- **📋 Relatórios**: Geração automática de PDFs
- **🌐 Multi-idioma**: Internacionalização

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal** - [Seu Nome](https://github.com/seu-usuario)
- **Arquitetura e ML** - Especialista em análise de dados cardiovasculares

## 📞 Contato

- 📧 Email: seu.email@exemplo.com
- 🐙 GitHub: [@seu-usuario](https://github.com/seu-usuario)
- 💼 LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)

---

<div align="center">

**💓 Heartbeat Insights - Transformando dados em saúde**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://mongodb.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>
