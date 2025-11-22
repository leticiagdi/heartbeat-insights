// === funcoes de dashboard personalizado ===
// variaveis globais (definidas em script.js)
/* global API_BASE, authToken, showMessage, loadDashboards, Chart */

let customChartInstance = null;

// mostrar modal de dashboard personalizado
function showCreateCustomDashboard() {
    initCustomDashboardForm(); // Garantir que o form está inicializado
    const modal = document.getElementById('custom-dashboard-modal');
    modal.classList.add('show');
}

// atualizar formulario baseado no tipo de grafico selecionado
function updateChartForm() {
    const chartType = document.querySelector('[name="chartType"]').value;
    const dataSection = document.getElementById('chart-data-section');
    const dataInputs = document.getElementById('data-inputs');
    
    if (chartType) {
        dataSection.style.display = 'block';
        dataInputs.innerHTML = '';
        
        // adicionar inputs iniciais baseados no tipo
        if (chartType === 'pie' || chartType === 'doughnut') {
            addDataPoint('Hipertensão', '450');
            addDataPoint('Arritmia', '280');
            addDataPoint('Saudáveis', '520');
        } else if (chartType === 'bar') {
            addDataPoint('Janeiro', '45');
            addDataPoint('Fevereiro', '52');
            addDataPoint('Março', '48');
        } else if (chartType === 'line') {
            addDataPoint('Jan', '45');
            addDataPoint('Fev', '52');
            addDataPoint('Mar', '48');
        }
    } else {
        dataSection.style.display = 'none';
    }
}

// adicionar ponto de dados
function addDataPoint(labelValue = '', dataValue = '') {
    const dataInputs = document.getElementById('data-inputs');
    const pointId = Date.now();
    
    const dataPoint = document.createElement('div');
    dataPoint.className = 'data-point';
    dataPoint.innerHTML = `
        <input type="text" placeholder="Ex: Hipertensão" value="${labelValue}" name="label-${pointId}" required>
        <input type="number" placeholder="Valor" value="${dataValue}" name="value-${pointId}" required>
        <button type="button" onclick="removeDataPoint(this)" class="remove-btn">🗑️</button>
    `;
    
    dataInputs.appendChild(dataPoint);
}

// remover ponto de dados
function removeDataPoint(button) {
    button.parentElement.remove();
}

// atualizar preview do grafico
function updatePreview() {
    const form = document.getElementById('custom-dashboard-form');
    const formData = new FormData(form);
    const chartType = formData.get('chartType');
    
    if (!chartType) {
        showMessage('Selecione um tipo de gráfico primeiro!', 'error');
        return;
    }
    
    // coletar dados dos inputs
    const labels = [];
    const data = [];
    const inputs = document.querySelectorAll('#data-inputs .data-point');
    
    inputs.forEach(point => {
        const labelInput = point.querySelector('input[name^="label-"]');
        const valueInput = point.querySelector('input[name^="value-"]');
        
        if (labelInput.value && valueInput.value) {
            labels.push(labelInput.value);
            data.push(parseInt(valueInput.value));
        }
    });
    
    if (labels.length === 0) {
        showMessage('Adicione pelo menos um item de dados!', 'error');
        return;
    }
    
    // mostrar secao de preview
    document.getElementById('preview-section').style.display = 'block';
    
    // destruir grafico anterior
    if (customChartInstance) {
        customChartInstance.destroy();
    }
    
    // criar novo grafico
    const ctx = document.getElementById('preview-chart').getContext('2d');
    
    const chartConfig = {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Dados',
                data: data,
                backgroundColor: generateColors(data.length),
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
    };
    
    if (chartType === 'line') {
        chartConfig.data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.2)';
        chartConfig.data.datasets[0].borderColor = '#3498db';
        chartConfig.data.datasets[0].fill = true;
    }
    
    customChartInstance = new Chart(ctx, chartConfig);
    showMessage('Preview atualizado! 👍', 'success');
}

// gerar cores para o grafico
function generateColors(count) {
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    const result = [];
    
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    
    return result;
}

// submeter dashboard personalizado
function initCustomDashboardForm() {
    const form = document.getElementById('custom-dashboard-form');
    if (form && !form.hasAttribute('data-initialized')) {
        form.setAttribute('data-initialized', 'true');
        form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const chartType = formData.get('chartType');
        const title = formData.get('title');
        const description = formData.get('description');
        
        // coletar dados
        const labels = [];
        const data = [];
        const inputs = document.querySelectorAll('#data-inputs .data-point');
        
        inputs.forEach(point => {
            const labelInput = point.querySelector('input[name^="label-"]');
            const valueInput = point.querySelector('input[name^="value-"]');
            
            if (labelInput.value && valueInput.value) {
                labels.push(labelInput.value);
                data.push(parseInt(valueInput.value));
            }
        });
        
        const dashboardData = {
            title: title,
            description: description,
            data: {
                chartType: chartType,
                labels: labels,
                values: data,
                totalItems: data.reduce((sum, val) => sum + val, 0)
            }
        };
        
        try {
            const response = await fetch(`${API_BASE}/api/analytics/dashboard`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dashboardData)
            });
            
            if (response.ok) {
                showMessage(`Dashboard "${title}" criado com sucesso! 🎉`, 'success');
                document.getElementById('custom-dashboard-modal').classList.remove('show');
                loadDashboards();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar dashboard');
            }
            
            // mostrar o grafico na pagina principal se desejar
            if (confirm('Deseja visualizar o gráfico criado na tela principal?')) {
                displayCustomChart(dashboardData.data, title);
            }
            
        } catch (error) {
            showMessage('Erro ao criar dashboard: ' + error.message, 'error');
        }
        });
    }
}

// inicializacao sera feita apenas quando o modal for aberto

// exibir grafico personalizado na tela principal
function displayCustomChart(chartData, title, dashboardId = null) {
    const chartId = dashboardId ? `chart-${dashboardId}` : 'mainCustomChart';
    const container = document.getElementById('custom-charts-container');
    
    // ocultar graficos cardiovasculares pre-definidos
    document.getElementById('charts-container').style.display = 'none';
    
    // verificar se ja existe um grafico para este dashboard
    const existingChart = document.getElementById(chartId);
    if (existingChart) {
        existingChart.parentElement.remove();
    }
    
    // criar novo card de grafico
    const chartCard = document.createElement('div');
    chartCard.className = 'chart-card';
    chartCard.innerHTML = `
        <div class="chart-header">
            <h3>${title}</h3>
            <button onclick="removeChart('${chartId}')" class="btn-close">×</button>
        </div>
        <canvas id="${chartId}" width="400" height="200"></canvas>
    `;
    
    container.appendChild(chartCard);
    container.style.display = 'grid';
    
    // criar grafico com os dados salvos
    const ctx = document.getElementById(chartId).getContext('2d');
    const chartConfig = {
        type: chartData.chartType,
        data: {
            labels: chartData.labels || [],
            datasets: [{
                label: 'Dados',
                data: chartData.values || chartData.data || [],
                backgroundColor: generateColors((chartData.values || chartData.data || []).length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    };
    
    // configuracoes especificas por tipo de grafico
    if (chartData.chartType === 'line') {
        chartConfig.data.datasets[0].backgroundColor = 'rgba(52, 152, 219, 0.2)';
        chartConfig.data.datasets[0].borderColor = '#3498db';
        chartConfig.data.datasets[0].fill = true;
    }
    
    new Chart(ctx, chartConfig);
}

// funcao para remover grafico individual
function removeChart(chartId) {
    const chart = document.getElementById(chartId);
    if (chart) {
        chart.parentElement.remove();
        
        // verificar se ainda ha graficos
        const container = document.getElementById('charts-container');
        if (container.children.length === 0) {
            container.style.display = 'none';
        }
    }
}