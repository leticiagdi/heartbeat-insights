📊 Pipeline de Geração de Insights Cardiovasculares (V2)

Este diretório contém os scripts Python responsáveis por processar o dataset Heart_Disease_Prediction.csv, realizar a Análise Exploratória de Dados (EDA) e enviar os resultados estruturados (Dashboards e Insights) para o backend Node.js (MongoDB).

O objetivo desta pipeline é transformar dados brutos em informação médica acionável, garantindo que cada alerta no frontend tenha um contexto visual claro (Dashboard) e vice-ponto.

1. 🎯 Fluxo de Trabalho (Pipeline Orquestrada)

A pipeline V2 executa o seguinte fluxo de maneira sequencial:

Carregamento de Dados: O data_loader.py carrega e limpa o CSV.

Geração de Dashboards: O dashboard_generator_v2.py cria 3 payloads JSON de Dashboards (agrupados por foco médico).

Envio de Dashboards: O pipeline.py envia esses 3 payloads para a API /api/analytics/dashboard, obtendo o ID de cada Dashboard criado.

Geração de Insights: O insight_generator_v2.py cria 3 Insights (alertas e conclusões).

Vinculação e Envio de Insights: O pipeline.py injeta o ID do Dashboard correspondente em cada Insight e os envia para a API /api/analytics/insights.

Resultado: 3 Dashboards na coleção dashboards e 3 Insights totalmente vinculados na coleção insights.

2. 📁 Estrutura do Diretório

Esta pasta é o ambiente de execução da pipeline.

pipeline/
├── src/
│   ├── data_loader.py               # (Lê o CSV, limpa, cria colunas descritivas como Target_Desc)
│   ├── dashboard_generator_v2.py    # (Cria os 3 Dashboards com os dados de gráficos)
│   └── insight_generator_v2.py      # (Cria os 3 Insights acionáveis e define o Dashboard alvo)
├── pipeline.py                      # (O script orquestrador principal - O QUE VOCÊ DEVE EXECUTAR)
└── requirements.txt                 # (Lista de bibliotecas Python necessárias)


3. ⚙️ Configuração e Dependências

3.1 Requisitos de Ambiente

Para rodar esta pipeline, você precisa do Python 3.x e de um ambiente virtual ativo.

Ativar o Venv (Prompt de Comando/CMD):

.\venv\Scripts\activate


Instalar Dependências:

pip install -r requirements.txt


3.2 Variáveis de Ambiente (.env)

O script depende das seguintes variáveis, que devem estar configuradas no arquivo .env na raiz do projeto:

Variável

Descrição

Uso

ADMIN_TOKEN

JWT de um usuário administrador para autenticar nas rotas /admin.

Necessário para POST /dashboard e POST /insights.

API_BASE_URL

URL base do servidor Express (ex: http://localhost:5000).

Usado para construir os endpoints da API.

DATA_FILE_PATH

O caminho para o CSV de dados (ex: Heart_Disease_Prediction.csv).

Caminho para o arquivo de origem da análise.

4. 🚀 Tipos de Dashboards Gerados

A análise V2 foi segmentada em 3 áreas médicas. Cada Dashboard é um contêiner visual:

Categoria

Título do Dashboard

Foco Principal

Gráficos Contidos

I. Demográfico

Dashboard 1: Perfil Demográfico e Prevalência

Distribuição de Risco por Idade e Sexo.

Gráfico de Pizza (Prevalência Geral).

II. Metabólico

Dashboard 2: Biomarcadores de Risco Metabólico

Risco associado a Glicemia (FBS) e Pressão/Colesterol.

Gráfico de Barras (Risco por FBS) e Dados para Scatter Plot (BP vs. Colesterol).

III. Isquemia

Dashboard 3: Análise de Isquemia e Teste de Estresse

Risco baseado em resultados de teste de estresse (MaxHR, Oldpeak) e dor no peito.

Gráfico de Barras (Tipos de Dor) e Dados para Scatter Plot (MaxHR vs. Oldpeak).

5. 🧑‍💻 Execução

Execute a pipeline a partir do diretório heartbeat-insights/:

python pipeline.py


Se a execução for bem-sucedida, você verá logs de ✅ Dashboard criado. ID: ... e ✅ Sucesso: Insight '...' vinculado a '...'.

6. 🤝 Próximo Passo (Frontend / Colega)

Para que o frontend acesse os dados, ele deve seguir este fluxo:

GET Insights: Chamar GET /api/analytics/insights para obter a lista de alertas e o dashboardId vinculado a cada alerta.

GET Dashboard: Usar o dashboardId para chamar GET /api/analytics/dashboard/:id e extrair o JSON de visualização (data.chartType, data.labels, data.values).

Renderizar: Usar as chaves chartType (pie, bar) e os arrays labels/values para construir o gráfico.

Exemplo de Vínculo:

O Insight: "Alto Risco de Doença em Pacientes com Mais de 60 Anos"

É vinculado ao dashboardId de: "Dashboard 1: Perfil Demográfico e Prevalência"