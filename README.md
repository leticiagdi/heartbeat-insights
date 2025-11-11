# 💓 Heartbeat Insights

> Uma plataforma de saúde pública para análises rápidas de doenças cardiovasculares com arquitetura híbrida otimizada para alta performance.

## 🎯 Visão Geral

O **Heartbeat Insights** é uma plataforma inovadora que combina o poder de processamento do Google Colab com a agilidade de APIs modernas para fornecer insights instantâneos sobre doenças cardiovasculares. A arquitetura híbrida garante que profissionais de saúde tenham acesso a análises complexas de forma rápida e intuitiva.

## 🏗️ Arquitetura Híbrida

```
📊 Dados Brutos → 🔬 Google Colab → 📈 Insights JSON → 🚀 Node.js API → ⚡ Frontend React
```

### 🔬 **Google Colab** (Motor de Processamento)
- Limpeza e processamento de datasets cardiovasculares
- Treinamento de modelos de Machine Learning
- Geração de correlações e estatísticas complexas
- Criação de insights formatados em JSON

### 🚀 **Node.js API** (Servidor de Dados)
- Recepção e armazenamento de insights pré-processados
- Autenticação JWT para controle de acesso
- APIs otimizadas para servir dados instantaneamente
- Gerenciamento de usuários e permissões

### 📊 **MongoDB** (Banco de Dados)
- Armazenamento de insights pré-calculados
- Coleções dedicadas para diferentes tipos de análise
- Otimização para consultas rápidas

### ⚡ **Frontend React** (Interface de Usuário)
- Dashboard responsivo e intuitivo
- Gráficos interativos em tempo real
- Carregamento instantâneo de dados pré-processados
- Interface otimizada para profissionais de saúde

## ✨ Principais Características

- **🚀 Performance Ultra-Rápida**: Dados pré-calculados garantem carregamento instantâneo
- **🔬 Análises Avançadas**: Processamento pesado realizado no Google Colab
- **🔐 Segurança**: Autenticação JWT e controle de acesso baseado em roles
- **📱 Responsivo**: Interface adaptável para desktop, tablet e mobile
- **⚡ Escalável**: Arquitetura preparada para grandes volumes de dados
- **🎨 Intuitivo**: Dashboard focado na experiência do usuário

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express.js** - API REST
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas
- **ES Modules** - Padrão moderno JavaScript

### Processamento de Dados
- **Python** - Análise de dados
- **Google Colab** - Ambiente de processamento
- **Pandas** - Manipulação de dados
- **Scikit-learn** - Machine Learning
- **Matplotlib/Seaborn** - Visualizações

### Frontend (Planejado)
- **React 19** - Interface de usuário
- **Vite** - Build tool otimizada
- **Chart.js/D3.js** - Gráficos interativos
- **Tailwind CSS** - Estilização moderna

## 📁 Estrutura do Projeto

```
heartbeat-insights/
├── src/
│   └── server/
│       ├── models/
│       │   ├── UserModel.js      # Schema de usuários
│       │   ├── dataModel.js      # Schema de dados médicos
│       │   └── insightModel.js   # Schema de insights pré-processados
│       ├── routes/
│       │   ├── authRoutes.js     # Autenticação e autorização
│       │   └── analyticsRoutes.js # APIs de insights
│       └── index.js              # Servidor principal
├── docs/
│   ├── ARQUITETURA.md           # Documentação da arquitetura
│   └── colab_integration_example.py # Exemplo de integração Colab
├── package.json
└── README.md
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
```

### 4. Inicie o servidor
```bash
npm run server
```

O servidor estará rodando em `http://localhost:5000`

## 📡 APIs Disponíveis

### Autenticação
```http
POST /api/auth/register    # Registrar usuário
POST /api/auth/login       # Login
```

### Analytics (Protegidas)
```http
GET  /api/analytics/dashboard           # Dashboard principal
GET  /api/analytics/insights           # Todos os insights
GET  /api/analytics/insights/:category # Insights por categoria
POST /api/analytics/insights           # Enviar insights (Admin)
```

### Categorias de Insights
- `dashboard` - Estatísticas gerais e KPIs
- `correlations` - Análises de correlação
- `distributions` - Distribuições e histogramas  
- `predictions` - Resultados de modelos ML
- `trends` - Análises temporais

## 🔬 Integração com Google Colab

O Google Colab envia insights processados via API REST:

```python
import requests

# Configuração
API_URL = "http://localhost:5000/api/analytics/insights"
headers = {"Authorization": "Bearer {admin_token}"}

# Enviar insight
insight_data = {
    "title": "Correlação Idade vs Pressão",
    "category": "correlations", 
    "chartData": {...},
    "statistics": {...}
}

response = requests.post(API_URL, json=insight_data, headers=headers)
```

Veja o exemplo completo em [`docs/colab_integration_example.py`](docs/colab_integration_example.py)

## 🧪 Testando a API

### Registrar um usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@teste.com","password":"123456"}'
```

### Fazer login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","password":"123456"}'
```

### Acessar dashboard (com token)
```bash
curl -H "Authorization: Bearer {seu_token}" \
  http://localhost:5000/api/analytics/dashboard
```

## 🎯 Vantagens da Arquitetura

### ⚡ **Performance**
- Dados pré-processados = carregamento instantâneo
- Sem análises em tempo real no frontend
- Cache otimizado para consultas frequentes

### 🔬 **Poder de Processamento**
- Google Colab lida com datasets gigantes
- Modelos de ML treinados offline
- Análises complexas sem impactar a API

### 📈 **Escalabilidade**
- Múltiplos notebooks podem enviar insights
- API focada apenas em servir dados
- Banco otimizado para consultas rápidas

### 🛠️ **Manutenibilidade**
- Separação clara de responsabilidades
- Código modular e bem documentado
- Fácil adicionar novos tipos de análise

## 🚦 Status do Projeto

- ✅ **Backend API** - Completo e funcional
- ✅ **Modelos de Dados** - Schemas MongoDB definidos
- ✅ **Autenticação** - JWT implementado
- ✅ **Integração Colab** - Exemplo e documentação
- ⏳ **Frontend React** - Em planejamento
- ⏳ **Deploy** - Em planejamento

## 📈 Próximos Passos

1. **Desenvolvimento do Frontend React**
2. **Implementação de gráficos interativos**
3. **Testes de integração completos**
4. **Sistema de cache avançado**
5. **Deploy em produção**
6. **Documentação para usuários finais**

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
