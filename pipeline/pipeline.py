import json
import os
import time

import requests
from dotenv import load_dotenv

from src.dashboard import generate_all_dashboards_payloads
from src.data_loader import load_and_preprocess_data
from src.insights import generate_key_insights


load_dotenv()

DATA_FILE_PATH = "Heart_Disease_Prediction.csv"
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")


def send_to_api(endpoint: str, payload: dict, token: str) -> dict | None:
    """Função genérica para enviar payload para a API e retornar a resposta JSON."""
    if not token:
        print("ERRO: ADMIN_TOKEN não encontrado. Abortando envio.")
        return None
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    api_url = f"{API_BASE_URL}/{endpoint}"

    try:
        response = requests.post(api_url, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Erro ao enviar para '{endpoint}'. Erro: {e}")
        return None


def run_v2_pipeline():
    """Orquestra a geração de 3 Dashboards e 3 Insights, vinculando-os."""

    print("1. INICIANDO O PIPELINE V2: ANÁLISE ESTRUTURADA")

    # 1. Carregamento de Dados
    df_orig, df_eda = load_and_preprocess_data(DATA_FILE_PATH)

    if df_orig is None:
        print("Pipeline abortado devido a erro de carregamento de dados.")
        return

    print("\n2.CRIANDO E ENVIANDO 3 DASHBOARDS DE ALTO NÍVEL")

    payloads_list = generate_all_dashboards_payloads(df_eda)

    dashboards_metadata = {}

    for payload in payloads_list:
        title = payload["title"]
        print(f"[+] Criando Dashboard: '{title}'...")

        response_data = send_to_api("api/analytics/dashboard", payload, ADMIN_TOKEN)

        if response_data and "dashboard" in response_data:
            dashboard_id = response_data["dashboard"]["_id"]
            dashboards_metadata[title] = dashboard_id
            print(f"Dashboard criado. ID: {dashboard_id}")
        else:
            print(f"Falha Crítica ao criar Dashboard: {title}")

        time.sleep(0.1)

    # Gera os 3 insights principais (um para cada Dashboard)
    all_insights = generate_key_insights(df_eda)
    insights_sent = 0

    print(f"\nTotal de insights gerados: {len(all_insights)}")
    print("\n3.VINCULANDO E ENVIANDO INSIGHTS DE CADA DASHBOARD")

    for i, insight in enumerate(all_insights):
        target_dashboard_title = insight.pop("targetDashboardTitle", None)

        if target_dashboard_title and target_dashboard_title in dashboards_metadata:
            dashboard_id = dashboards_metadata[target_dashboard_title]
            insight["dashboardId"] = dashboard_id

            response_insight = send_to_api(
                "api/analytics/insights", insight, ADMIN_TOKEN
            )

            if response_insight and "insight" in response_insight:
                print(
                    f"Sucesso ({i+1}/{len(all_insights)}): Insight '{insight['title']}' vinculado a '{target_dashboard_title}'."
                )
                insights_sent += 1
            else:
                print(
                    f"  Falha ({i+1}/{len(all_insights)}): Insight '{insight['title']}' falhou no envio."
                )
        else:
            print(
                f"  Falha: Insight '{insight['title']}' não encontrou Dashboard alvo."
            )

        time.sleep(0.1)

    print(f"\nProcesso V2 finalizado. {insights_sent} Insights vinculados.")


if __name__ == "__main__":
    run_v2_pipeline()
