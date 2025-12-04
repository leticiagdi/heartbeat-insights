import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")
LOGIN_ENDPOINT = f"{API_BASE_URL}/api/auth/login"

ADMIN_CREDENTIALS = {"email": "marianaluisa@gmail.com", "password": "Mariana#123"}


def get_admin_token(login_url: str, credentials: dict) -> str | None:
    """
    Tenta logar na API e retorna o JWT (ADMIN_TOKEN) em caso de sucesso.
    """
    print(f"--- Tentando logar em: {login_url} ---")

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(login_url, json=credentials, headers=headers)
        response.raise_for_status()
        data = response.json()
        token = data.get("token") or data.get("accessToken")

        if token:
            print("Login bem-sucedido!")
            return token
        else:
            print(
                "Erro: O login foi bem-sucedido, mas o token não foi encontrado na resposta."
            )
            print(f"Resposta da API: {data}")
            return None

    except requests.exceptions.HTTPError:
        print(f"Erro HTTP ao logar. Status: {response.status_code}.")
        print(f"Mensagem de erro da API: {response.text}")
    except requests.exceptions.RequestException as e:
        print(
            f"Erro de Conexão: Verifique se o servidor Express está rodando em {API_BASE_URL}. Erro: {e}"
        )
    except json.JSONDecodeError:
        print("Erro ao decodificar a resposta JSON da API.")

    return None


if __name__ == "__main__":
    jwt_token = get_admin_token(LOGIN_ENDPOINT, ADMIN_CREDENTIALS)

    if jwt_token:
        print(f"TOKEN: {jwt_token}")
