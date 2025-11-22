# Exemplo de código Python para o Google Colab
# Como enviar insights processados para o Node.js

import requests
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Configurações da API
API_BASE_URL = "http://localhost:5000/api"
ADMIN_TOKEN = "seu_token_admin_aqui"  # Token de usuário admin

headers = {
    "Authorization": f"Bearer {ADMIN_TOKEN}",
    "Content-Type": "application/json"
}

# Exemplo 1: Enviando estatísticas do dashboard
def send_dashboard_stats(df):
    """
    Envia estatísticas básicas do dataset para o dashboard
    """
    
    # Processa estatísticas
    total_samples = len(df)
    disease_count = df['target'].sum()
    disease_percentage = (disease_count / total_samples) * 100
    avg_age = df['age'].mean()
    
    # Prepara dados para gráfico de pizza
    chart_data = {
        "labels": ["Sem Doença", "Com Doença"],
        "values": [total_samples - disease_count, disease_count]
    }
    
    insight_data = {
        "title": "Distribuição de Doenças Cardíacas",
        "category": "dashboard",
        "chartData": chart_data,
        "chartConfig": {
            "type": "pie",
            "title": "Distribuição de Pacientes",
            "colors": ["#10B981", "#EF4444"]
        },
        "statistics": {
            "totalSamples": total_samples,
            "diseasePercentage": round(disease_percentage, 2),
            "averageAge": round(avg_age, 1),
            "keyInsights": [
                f"Dataset contém {total_samples} amostras",
                f"{disease_percentage:.1f}% dos pacientes têm doença cardíaca",
                f"Idade média: {avg_age:.1f} anos"
            ]
        },
        "metadata": {
            "colabNotebookId": "exemplo_dashboard_v1",
            "datasetVersion": "v1.0",
            "recordCount": total_samples
        }
    }
    
    # Envia para a API
    response = requests.post(f"{API_BASE_URL}/analytics/insights", 
                           headers=headers, 
                           json=insight_data)
    
    if response.status_code == 201:
        print("✅ Dashboard stats enviadas com sucesso!")
    else:
        print(f"❌ Erro: {response.json()}")

# Exemplo 2: Enviando correlações
def send_correlation_analysis(df):
    """
    Envia análise de correlação entre variáveis
    """
    
    # Calcula correlações
    numeric_cols = df.select_dtypes(include=['number']).columns
    corr_matrix = df[numeric_cols].corr()
    
    # Prepara dados para heatmap
    chart_data = {
        "matrix": corr_matrix.round(3).to_dict(),
        "variables": list(numeric_cols)
    }
    
    insight_data = {
        "title": "Matriz de Correlação - Variáveis Cardíacas",
        "category": "correlations",
        "chartData": chart_data,
        "chartConfig": {
            "type": "heatmap",
            "title": "Correlações entre Variáveis",
            "xAxis": "Variáveis",
            "yAxis": "Variáveis"
        },
        "statistics": {
            "totalVariables": len(numeric_cols),
            "strongestCorrelation": float(corr_matrix.abs().unstack().sort_values(ascending=False).iloc[1]),
            "keyInsights": [
                "Análise de correlação entre todas as variáveis numéricas",
                f"Maior correlação absoluta: {corr_matrix.abs().unstack().sort_values(ascending=False).iloc[1]:.3f}"
            ]
        },
        "metadata": {
            "colabNotebookId": "correlation_analysis_v1",
            "processingTime": 2.5
        }
    }
    
    response = requests.post(f"{API_BASE_URL}/analytics/insights", 
                           headers=headers, 
                           json=insight_data)
    
    if response.status_code == 201:
        print("✅ Análise de correlação enviada!")
    else:
        print(f"❌ Erro: {response.json()}")

# Exemplo 3: Enviando resultados de modelo ML
def send_model_results(model_accuracy, feature_importance):
    """
    Envia resultados de modelo de machine learning
    """
    
    chart_data = {
        "features": list(feature_importance.keys()),
        "importance": list(feature_importance.values())
    }
    
    insight_data = {
        "title": "Importância das Features - Modelo Random Forest",
        "category": "predictions",
        "chartData": chart_data,
        "chartConfig": {
            "type": "bar",
            "title": "Feature Importance",
            "xAxis": "Features",
            "yAxis": "Importância"
        },
        "statistics": {
            "accuracy": round(model_accuracy, 4),
            "topFeature": max(feature_importance, key=feature_importance.get),
            "keyInsights": [
                f"Acurácia do modelo: {model_accuracy:.2%}",
                f"Feature mais importante: {max(feature_importance, key=feature_importance.get)}"
            ]
        },
        "metadata": {
            "colabNotebookId": "ml_model_v2",
            "modelType": "RandomForest"
        }
    }
    
    response = requests.post(f"{API_BASE_URL}/analytics/insights", 
                           headers=headers, 
                           json=insight_data)
    
    if response.status_code == 201:
        print("✅ Resultados do modelo enviados!")
    else:
        print(f"❌ Erro: {response.json()}")

# Exemplo de uso:
# df = pd.read_csv("heart_disease_data.csv")
# send_dashboard_stats(df)
# send_correlation_analysis(df)
# send_model_results(0.85, {"age": 0.3, "cp": 0.25, "thalach": 0.2})