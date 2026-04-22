from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

GRUPO_PERMITIDO = "COLOQUE_O_ID_DO_GRUPO@g.us"

negociacoes = {}
avaliacoes = {}

class Msg(BaseModel):
    message: str
    phone: str
    isGroup: bool
    chatId: str


@app.post("/webhook")
def webhook(data: Msg):

    texto = data.message.strip()
    user = data.phone

    # 🔒 só responde privado ou grupo permitido
    if data.isGroup and data.chatId != GRUPO_PERMITIDO:
        return {"reply": ""}

    texto_lower = texto.lower()

    # /start
    if texto_lower in ["oi", "/start"]:
        return {
            "reply": "💖 *Score do Desapego*\n\n"
                     "Comandos:\n"
                     "/negociacao @user\n"
                     "/confirmar\n"
                     "/avaliar 5 ótimo"
        }

    # /negociacao
    if texto_lower.startswith("/negociacao"):
        partes = texto.split()

        if len(partes) < 2:
            return {"reply": "Use: /negociacao @usuario"}

        alvo = partes[1]

        negociacoes[user] = {"alvo": alvo, "confirmado": False}

        return {
            "reply": f"🤝 Negociação com {alvo}\nUse /confirmar"
        }

    # /confirmar
    if texto_lower.startswith("/confirmar"):
        if user not in negociacoes:
            return {"reply": "Nenhuma negociação encontrada"}

        negociacoes[user]["confirmado"] = True

        return {"reply": "✅ Confirmado! Use /avaliar"}

    # /avaliar
    if texto_lower.startswith("/avaliar"):
        partes = texto.split()

        if len(partes) < 3:
            return {"reply": "Use: /avaliar nota comentario"}

        try:
            nota = int(partes[1])
        except:
            return {"reply": "Nota inválida"}

        comentario = " ".join(partes[2:])

        if nota < 1 or nota > 5:
            return {"reply": "Nota deve ser 1 a 5"}

        if user not in avaliacoes:
            avaliacoes[user] = []

        avaliacoes[user].append(nota)

        media = sum(avaliacoes[user]) / len(avaliacoes[user])

        return {
            "reply": f"⭐ Avaliado!\nNota: {nota}\nMédia: {media:.1f}"
        }

    return {"reply": "🤔 Não entendi. Use /start"}