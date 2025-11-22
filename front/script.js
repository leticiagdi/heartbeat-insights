// -*- coding: utf-8 -*-
// configuracao da api
const API_BASE = 'http://localhost:5000';
let currentUser = null;
let authToken = null;

// elementos do dom
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const insightsSection = document.getElementById('insights-section');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userRole = document.getElementById('user-role');
const adminControls = document.getElementById('admin-controls');
const adminInsightsControls = document.getElementById('admin-insights-controls');

// inicializacao
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuth();
});

// event listeners
function setupEventListeners() {
    // login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // dashboard form
    document.getElementById('dashboard-form').addEventListener('submit', handleCreateDashboard);
    
    // insight form
    document.getElementById('insight-form').addEventListener('submit', handleCreateInsight);
}

// funcoes de autenticacao
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showMainInterface();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage('Login realizado com sucesso!', 'success');
            showMainInterface();
        } else {
            showMessage(data.message || 'Erro no login', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor', 'error');
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Usuário criado com sucesso! Faça login.', 'success');
            document.getElementById('register-form').reset();
        } else {
            showMessage(data.message || 'Erro no registro', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor', 'error');
        console.error('Register error:', error);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showLogin();
    showMessage('Logout realizado com sucesso!', 'info');
}

// funcoes de interface
function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    insightsSection.style.display = 'none';
    userInfo.style.display = 'none';
}

function showMainInterface() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    insightsSection.style.display = 'block';
    userInfo.style.display = 'flex';
    
    // atualizar info do usuario
    userName.textContent = currentUser.name;
    userRole.textContent = currentUser.role;
    userRole.className = `role ${currentUser.role}`;
    
    // mostrar controles de admin
    if (currentUser.role === 'admin') {
        adminControls.style.display = 'block';
        adminInsightsControls.style.display = 'block';
    }
    
    // carregar dados
    loadDashboards();
    loadInsights();
}

// funcoes de dashboard
async function loadDashboards() {
    try {
        const response = await fetch(`${API_BASE}/api/analytics/dashboard`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayDashboards(data.dashboards);
        } else {
            showMessage(data.message || 'Erro ao carregar dashboards', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Load dashboards error:', error);
    }
}

function displayDashboards(dashboards) {
    const container = document.getElementById('dashboards-list');
    
    if (!dashboards || dashboards.length === 0) {
        container.innerHTML = '<p>Nenhum dashboard encontrado.</p>';
        return;
    }
    
    container.innerHTML = dashboards.map(dashboard => {
        // verificar se tem dados cardiovasculares estruturados
        const hasCardiovascularData = dashboard.cardiovascularData && dashboard.cardiovascularData.totalPatients > 0;
        const hasCustomChart = dashboard.data && dashboard.data.chartType;
        
        let dataInfo = '';
        let viewButton = '';
        
        if (hasCardiovascularData) {
            dataInfo = `<span class="data-type cardiovascular">🫀 Dados Cardiovasculares (${dashboard.cardiovascularData.totalPatients} pacientes)</span>`;
            viewButton = `<button onclick="loadCardiovascularDashboard('${dashboard._id}')" class="btn-primary">Ver Gráficos</button>`;
        } else if (hasCustomChart) {
            dataInfo = `<span class="data-type custom">📊 ${dashboard.data.chartType.toUpperCase()} - ${dashboard.data.totalItems || dashboard.data.values?.length || 0} itens</span>`;
            viewButton = `<button onclick="loadCustomDashboard('${dashboard._id}')" class="btn-secondary">Ver Gráfico</button>`;
        } else {
            dataInfo = `<span class="data-type basic">📋 Dashboard Básico</span>`;
        }
        
        return `
            <div class="dashboard-item ${hasCardiovascularData ? 'cardiovascular' : hasCustomChart ? 'custom' : 'basic'}">
                <div class="dashboard-header">
                    <h4>${dashboard.title}</h4>
                    ${dataInfo}
                </div>
                <p>${dashboard.description}</p>
                <small>Criado: ${new Date(dashboard.createdAt).toLocaleDateString('pt-BR')}</small>
                <div class="dashboard-actions">
                    ${viewButton}
                    <button onclick="deleteDashboard('${dashboard._id}')" class="btn-danger">Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

async function handleCreateDashboard(e) {
    e.preventDefault();
    
    const title = document.getElementById('dashboard-title').value;
    const description = document.getElementById('dashboard-description').value;
    const dataText = document.getElementById('dashboard-data').value;
    
    try {
        const data = JSON.parse(dataText);
        
        const response = await fetch(`${API_BASE}/api/analytics/dashboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, description, data })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Dashboard criado com sucesso!', 'success');
            closeModal('create-dashboard-modal');
            document.getElementById('dashboard-form').reset();
            loadDashboards();
        } else {
            showMessage(result.message || 'Erro ao criar dashboard', 'error');
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            showMessage('JSON inválido! Use aspas duplas, vírgulas corretas e chaves fechadas. Ex: {"campo": "valor"}', 'error');
        } else {
            showMessage('Erro de conexão', 'error');
            console.error('Create dashboard error:', error);
        }
    }
}

// funcoes de insights
async function loadInsights() {
    try {
        const response = await fetch(`${API_BASE}/api/analytics/insights`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayInsights(data.insights);
        } else {
            showMessage(data.message || 'Erro ao carregar insights', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Load insights error:', error);
    }
}

function displayInsights(insights) {
    const container = document.getElementById('insights-list');
    
    if (!insights || insights.length === 0) {
        container.innerHTML = '<p>Nenhum insight encontrado.</p>';
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-content">${insight.content}</div>
            <div class="insight-meta">
                <span class="insight-type ${insight.type}">${insight.type}</span>
                <span class="insight-priority ${insight.priority}">${insight.priority}</span>
            </div>
            <small>Criado em: ${new Date(insight.createdAt).toLocaleDateString('pt-BR')}</small>
        </div>
    `).join('');
}

async function handleCreateInsight(e) {
    e.preventDefault();
    
    const title = document.getElementById('insight-title').value;
    const content = document.getElementById('insight-content').value;
    const type = document.getElementById('insight-type').value;
    const priority = document.getElementById('insight-priority').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/analytics/insights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, content, type, priority })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Insight criado com sucesso!', 'success');
            closeModal('create-insight-modal');
            document.getElementById('insight-form').reset();
            loadInsights();
        } else {
            showMessage(result.message || 'Erro ao criar insight', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Create insight error:', error);
    }
}

// funcoes de modal
function showCreateDashboard() {
    const modal = document.getElementById('create-dashboard-modal');
    if (modal) {
        modal.classList.add('show');
        
        // adicionar validacao em tempo real do JSON
        const jsonField = document.getElementById('dashboard-data');
        jsonField.addEventListener('input', validateJsonInput);
    }
}

// validar entrada JSON em tempo real
function validateJsonInput(event) {
    const jsonText = event.target.value.trim();
    
    if (jsonText.length === 0) return;
    
    try {
        JSON.parse(jsonText);
        event.target.style.borderColor = '#28a745'; // verde para válido
        event.target.title = 'JSON válido ✓';
    } catch (error) {
        event.target.style.borderColor = '#dc3545'; // vermelho para inválido
        
        // dicas específicas baseadas no erro
        if (error.message.includes('Unexpected token')) {
            if (jsonText.includes("'")) {
                event.target.title = 'Erro: Use aspas duplas (") ao invés de aspas simples (\')';
            } else if (!jsonText.startsWith('{')) {
                event.target.title = 'Erro: JSON deve começar com { e terminar com }';
            } else {
                event.target.title = 'Erro: Verifique vírgulas, dois pontos e chaves';
            }
        } else {
            event.target.title = 'JSON inválido: ' + error.message;
        }
    }
}

function showCreateInsight() {
    document.getElementById('create-insight-modal').classList.add('show');
}

function closeModal(modalId) {
    if (modalId) {
        document.getElementById(modalId).classList.remove('show');
    } else {
        // se nao especificar modalId, fechar todos os modais visiveis
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => modal.classList.remove('show'));
    }
}

// funcao de mensagens
function showMessage(text, type) {
    const messagesContainer = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    messagesContainer.appendChild(message);
    
    // remove a mensagem apos 5 segundos
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 5000);
}

// Fechar modal clicando fora
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// funcao para deletar dashboard
async function deleteDashboard(dashboardId) {
    if (!confirm('Tem certeza que deseja excluir este dashboard?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/analytics/dashboard/${dashboardId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showMessage('Dashboard excluído com sucesso!', 'success');
            loadDashboards(); // Recarregar lista
        } else {
            const data = await response.json();
            showMessage(data.message || 'Erro ao excluir dashboard', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Delete dashboard error:', error);
    }
}

// carregar dashboard cardiovascular existente
async function loadCardiovascularDashboard(dashboardId) {
    try {
        const response = await fetch(`${API_BASE}/api/analytics/dashboard/${dashboardId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const dashboard = await response.json();
            
            if (dashboard.cardiovascularData) {
                // limpar visualizacoes existentes
                clearAllCharts();
                displaySummaryCards(dashboard.cardiovascularData);
                displayCharts(dashboard.cardiovascularData);
                showMessage(`Dashboard "${dashboard.title}" carregado! 🫀`, 'success');
            }
        } else {
            showMessage('Erro ao carregar dashboard cardiovascular', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Load cardiovascular dashboard error:', error);
    }
}

// carregar dashboard personalizado existente  
async function loadCustomDashboard(dashboardId) {
    try {
        const response = await fetch(`${API_BASE}/api/analytics/dashboard/${dashboardId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const dashboard = await response.json();
            
            console.log('Dashboard carregado:', dashboard); // Debug
            console.log('Dados do dashboard:', dashboard.data); // Debug dos dados
            
            // limpar visualizacoes existentes
            clearAllCharts();
            
            if (dashboard.data && dashboard.data.chartType) {
                displayCustomChart(dashboard.data, dashboard.title, dashboardId);
                showMessage(`Gráfico "${dashboard.title}" exibido! 📊`, 'success');
            } else {
                console.log('Estrutura do dashboard:', dashboard); // Debug completo
                showMessage('Dashboard não possui dados de gráfico válidos', 'warning');
            }
        } else {
            const errorData = await response.json();
            showMessage('Erro ao carregar gráfico: ' + (errorData.message || 'Erro desconhecido'), 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
        console.error('Load custom dashboard error:', error);
    }
}

// === funcoes de dashboard cardiovascular ===

// funcao para limpar visualizacoes
function clearAllCharts() {
    document.getElementById('charts-container').style.display = 'none';
    document.getElementById('custom-charts-container').style.display = 'none';
}

// funcao para gerar dashboard com dados cardiovasculares
async function generateSampleDashboard() {
    try {
        showNotification('Gerando dashboard cardiovascular...', 'info');
        const response = await apiCall('/analytics/generate-sample-dashboard', 'POST');
        
        showNotification('Dashboard cardiovascular gerado com sucesso! 🫀', 'success');
        
        // Mostrar cards de resumo
        displaySummaryCards(response.dashboard.cardiovascularData);
        
        // mostrar graficos
        displayCharts(response.dashboard.cardiovascularData);
        
        // Recarregar dashboards e insights
        loadDashboards();
        loadInsights();
        
    } catch (error) {
        showNotification('Erro ao gerar dashboard: ' + error.message, 'error');
    }
}

// funcao para exibir cards de resumo
function displaySummaryCards(data) {
    const summaryCards = document.getElementById('summary-cards');
    const totalConditions = data.conditions.hypertension + data.conditions.diabetes + data.conditions.heartDisease;
    
    summaryCards.innerHTML = `
        <div class="summary-card patients">
            <h3>${data.totalPatients}</h3>
            <p>Total de Pacientes</p>
        </div>
        <div class="summary-card conditions">
            <h3>${totalConditions}</h3>
            <p>Com Condições Cardíacas</p>
        </div>
        <div class="summary-card risks">
            <h3>${Math.round((data.riskFactors.sedentary / data.totalPatients) * 100)}%</h3>
            <p>Pacientes Sedentários</p>
        </div>
        <div class="summary-card">
            <h3>${Math.round((data.conditions.hypertension / data.totalPatients) * 100)}%</h3>
            <p>Com Hipertensão</p>
        </div>
    `;
}

// funcao para exibir graficos
function displayCharts(data) {
    // ocultar graficos personalizados
    document.getElementById('custom-charts-container').style.display = 'none';
    // mostrar graficos cardiovasculares pre-definidos
    document.getElementById('charts-container').style.display = 'grid';
    
    // grafico de faixa etaria
    createAgeChart(data.ageGroups);
    
    // grafico de condicoes
    createConditionsChart(data.conditions);
    
    // grafico de fatores de risco
    createRiskChart(data.riskFactors);
    
    // grafico de tendencias
    createTrendsChart(data.monthlyTrends);
}

// criar grafico de pizza para faixas etarias
function createAgeChart(ageData) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Menos de 30 anos', '30-50 anos', 'Mais de 50 anos'],
            datasets: [{
                data: [ageData.under30, ageData.between30_50, ageData.above50],
                backgroundColor: ['#3498db', '#f39c12', '#e74c3c'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// criar grafico de condicoes cardiovasculares
function createConditionsChart(conditions) {
    const ctx = document.getElementById('conditionsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Hipertensão', 'Diabetes', 'Doença Cardíaca', 'AVC', 'Obesidade'],
            datasets: [{
                data: [conditions.hypertension, conditions.diabetes, conditions.heartDisease, conditions.stroke, conditions.obesity],
                backgroundColor: ['#e74c3c', '#f39c12', '#9b59b6', '#34495e', '#1abc9c'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// criar grafico de fatores de risco
function createRiskChart(riskFactors) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tabagismo', 'Sedentarismo', 'Colesterol Alto', 'Histórico Familiar'],
            datasets: [{
                label: 'Número de Pacientes',
                data: [riskFactors.smoking, riskFactors.sedentary, riskFactors.highCholesterol, riskFactors.familyHistory],
                backgroundColor: ['#e67e22', '#e74c3c', '#f39c12', '#9b59b6'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// criar grafico de tendencias mensais
function createTrendsChart(trends) {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trends.map(t => t.month),
            datasets: [
                {
                    label: 'Novos Casos',
                    data: trends.map(t => t.newCases),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true
                },
                {
                    label: 'Recuperações',
                    data: trends.map(t => t.recoveries),
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}