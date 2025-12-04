import pandas as pd


def load_and_preprocess_data(file_path: str):
    """
    Carrega o dataset, renomeia colunas e aplica o mapeamento para strings descritivas (EDA).

    Retorna: df_original (para ML) e df_eda (para Análise Exploratória e Gráficos)
    """
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"ERRO: Arquivo não encontrado em {file_path}. Verifique o caminho.")
        return None, None

    # Renomear Colunas
    df.rename(
        columns={
            "Chest pain type": "ChestPainType",
            "FBS over 120": "FastingBS",
            "EKG results": "RestingECG",
            "Max HR": "MaxHR",
            "Exercise angina": "ExAngina",
            "ST depression": "Oldpeak",
            "Slope of ST": "ST_Slope",
            "Number of vessels fluro": "NumVessels",
            "Heart Disease": "Target",
        },
        inplace=True,
    )

    # DataFrame para ML
    df_original = df.copy()

    # Mapeamento para Análise Exploratória (EDA)
    df_eda = df.copy()

    mapping = {
        "Target_Desc": {
            "Absence": "Sem Doença Cardíaca",
            "Presence": "Com Doença Cardíaca",
        },
        "Target_Binary_Map": {"Absence": 0, "Presence": 1},
        "Sex": {0: "Feminino", 1: "Masculino"},
        "ChestPainType": {
            1: "Angina Típica",
            2: "Angina Atípica",
            3: "Dor Não-Anginosa",
            4: "Assintomática",
        },
        "FastingBS": {0: "Jejum Açúcar <= 120 mg/dl", 1: "Jejum Açúcar > 120 mg/dl"},
        "RestingECG": {
            0: "Normal",
            1: "Anormalidade ST-T",
            2: "Hipertrofia Ventricular",
        },
        "ExAngina": {0: "Não", 1: "Sim"},
        "ST_Slope": {1: "Ascendente", 2: "Plano", 3: "Descendente"},
        "Thallium": {3: "Normal", 6: "Defeito Fixo", 7: "Defeito Reversível"},
        "NumVessels": {
            0: "0 Vasos",
            1: "1 Vaso",
            2: "2 Vasos",
            3: "3 Vasos",
            4: "4 Vasos",
        },
    }

    target_desc_map = mapping.pop("Target_Desc")

    target_binary_map = mapping.pop("Target_Binary_Map")

    df_eda["Target_Binary"] = df_eda["Target"].map(target_binary_map)

    df_original["Target_Binary"] = df_original["Target"].map(target_binary_map)

    df_eda["Target_Desc"] = df_eda["Target"].map(target_desc_map)

    for col, map_dict in mapping.items():
        if col in df_eda.columns:
            df_eda[f"{col}_Desc"] = df_eda[col].map(map_dict)

    print("Data Loaded: DataFrame EDA com descrições criado.")

    return df_original, df_eda
