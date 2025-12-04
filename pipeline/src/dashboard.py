import pandas as pd


def generate_demographic_dashboard(df: pd.DataFrame):
    """Cria Dashboard 1: Perfil Demográfico e Prevalência."""

    total_patients = len(df)

    # 1. Segmentação de Idade
    age_groups = {
        "under40": len(df[df["Age"] < 40]),
        "between40_60": len(df[(df["Age"] >= 40) & (df["Age"] <= 60)]),
        "above60": len(df[df["Age"] > 60]),
    }

    # 2. Prevalência Geral (Pie Chart)
    prevalence_data = df["Target_Desc"].value_counts()

    return {
        "title": "Perfil Demográfico e Prevalência",
        "description": "Análise da distribuição da amostra por idade, sexo e prevalência geral de doença cardíaca.",
        "cardiovascularData": {
            "totalPatients": total_patients,
            "ageGroups": age_groups,
        },
        "data": {
            "chartType": "pie",
            "title": "Prevalência de Doença Cardíaca",
            "labels": prevalence_data.index.tolist(),
            "values": prevalence_data.tolist(),
        },
    }


def generate_biomarker_dashboard(df: pd.DataFrame):
    """Cria Dashboard 2: Biomarcadores de Risco Metabólico."""

    # 1. Colesterol vs. Pressão Arterial (BP)
    df_risk = df[df["Target_Desc"] == "Com Doença Cardíaca"]

    # 2. Risco por Glicemia em Jejum (FBS)
    risco_por_fbs = (
        df.groupby("FastingBS_Desc")["Target_Binary"]
        .value_counts(normalize=True)
        .mul(100)
        .unstack()
        .fillna(0)
    )

    taxa_elevada = (
        risco_por_fbs.loc["Jejum Açúcar > 120 mg/dl", 1]
        if 1 in risco_por_fbs.columns
        else 0
    )
    taxa_normal = (
        risco_por_fbs.loc["Jejum Açúcar <= 120 mg/dl", 1]
        if 1 in risco_por_fbs.columns
        else 0
    )

    return {
        "title": "Biomarcadores de Risco Metabólico",
        "description": "Comparação entre pressão arterial, colesterol e o impacto da glicemia em jejum no risco.",
        "data": {
            "chartType": "bar",
            "title": "Risco de Doença por Glicemia (FBS)",
            "labels": ["Glicemia Alta (> 120)", "Glicemia Normal (<= 120)"],
            "values": [round(taxa_elevada, 1), round(taxa_normal, 1)],
        },
        "cardiovascularData": {
            "riskPatientsScatter": df_risk[["BP", "Cholesterol"]].to_dict(
                "records"
            )  # Dados brutos para Scatter
        },
    }


def generate_test_stress_dashboard(df: pd.DataFrame):
    """Cria Dashboard 3: Análise de Isquemia e Teste de Estresse."""

    # 1. Distribuição de Dor no Peito em Pacientes Cardíacos
    doentes_por_dor = df[df["Target_Desc"] == "Com Doença Cardíaca"][
        "ChestPainType_Desc"
    ].value_counts()

    # 2. Relação MaxHR vs. Oldpeak (Depressão ST)
    corr_data = df[["MaxHR", "Oldpeak", "Target_Desc"]].to_dict("records")

    return {
        "title": "Análise de Isquemia e Teste de Estresse",
        "description": "Foco nos indicadores de dano miocárdico, como tipo de dor e capacidade cardíaca máxima.",
        "data": {
            "chartType": "bar",
            "title": "Distribuição de Dor (Pacientes Cardíacos)",
            "labels": doentes_por_dor.index.tolist(),
            "values": doentes_por_dor.tolist(),
        },
        "cardiovascularData": {"exerciseScatter": corr_data},
    }


def generate_all_dashboards_payloads(df_eda: pd.DataFrame) -> list:
    """Gera a lista completa de payloads dos 3 Dashboards."""

    print("Gerando payloads de Dashboards...")
    return [
        generate_demographic_dashboard(df_eda),
        generate_biomarker_dashboard(df_eda),
        generate_test_stress_dashboard(df_eda),
    ]
