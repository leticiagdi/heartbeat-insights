import pandas as pd


def generate_key_insights(df_eda: pd.DataFrame) -> list:
    """
    Gera 3 Insights chave, cada um referenciando um Dashboard alvo
    no campo 'targetDashboardTitle'.
    """

    insights = []

    doenca_acima_60 = df_eda[
        (df_eda["Age"] > 60) & (df_eda["Target_Desc"] == "Com Doença Cardíaca")
    ]
    risco_geral = (
        len(df_eda[df_eda["Target_Desc"] == "Com Doença Cardíaca"]) / len(df_eda)
    ) * 100

    if len(doenca_acima_60) > 0:
        percent_risco_em_60_mais = (
            len(doenca_acima_60) / len(df_eda[df_eda["Age"] > 60])
        ) * 100
    else:
        percent_risco_em_60_mais = 0

    content_1 = (
        f"A prevalência geral é de {risco_geral:.1f}%. No entanto, em pacientes acima de 60 anos, "
        f"o risco de diagnóstico sobe para {percent_risco_em_60_mais:.1f}%. É um risco crítico focado na idade."
    )

    insights.append(
        {
            "title": "Alto Risco de Doença em Pacientes com Mais de 60 Anos",
            "content": content_1,
            "type": "warning",
            "priority": "critical",
            "targetDashboardTitle": "Perfil Demográfico e Prevalência",  # <--- Vínculo
        }
    )

    doentes_fbs_alto = df_eda[
        (df_eda["FastingBS_Desc"] == "Jejum Açúcar > 120 mg/dl")
        & (df_eda["Target_Desc"] == "Com Doença Cardíaca")
    ]

    content_2 = (
        "Pacientes com glicemia em jejum elevada (FBS > 120 mg/dl) têm uma probabilidade significativamente maior "
        "de diagnóstico de doença cardíaca. Esta condição metabólica deve ser tratada como um fator de risco primário."
    )

    insights.append(
        {
            "title": "Glicemia Elevada é um Fator de Risco Crítico de Doença Cardíaca",
            "content": content_2,
            "type": "action",
            "priority": "high",
            "targetDashboardTitle": "Biomarcadores de Risco Metabólico",  # <--- Vínculo
            "actionItems": [
                {
                    "action": "Revisar todos os pacientes com FBS > 120 mg/dl",
                    "category": "monitoring",
                }
            ],
        }
    )

    doentes_por_dor = df_eda[df_eda["Target_Desc"] == "Com Doença Cardíaca"][
        "ChestPainType_Desc"
    ].value_counts()

    risco_assintomatico = doentes_por_dor.get("Assintomática", 0)

    content_3 = (
        f"Em pacientes com diagnóstico positivo, o tipo de dor mais comum é a 'Assintomática' ({risco_assintomatico} casos). "
        "Isto reforça a necessidade de não confiar em sintomas claros para o diagnóstico."
    )

    insights.append(
        {
            "title": "Assintomático é o Tipo de Dor mais Comum em Pacientes Cardíacos",
            "content": content_3,
            "type": "warning",
            "priority": "medium",
            "targetDashboardTitle": "Análise de Isquemia e Teste de Estresse",  # <--- Vínculo
        }
    )

    print("Insights principais gerados.")
    return insights
