# 💖 Welovers — Score do Desapego

Sistema de reputação para grupos de desapego no WhatsApp, focado em segurança, confiança e transparência nas negociações.

---

## 🎯 Objetivo

O *Score do Desapego* permite que usuários:

- se cadastrem com validação de identidade  
- registrem negociações  
- confirmem transações  
- avaliem compradores e vendedores  
- consultem reputação antes de negociar  

Tudo isso com moderação e aprovação das administradoras.

---

## 🧠 Como funciona

O sistema segue o fluxo:

1. 🤝 Negociação (`/negociacao`)  
2. 🔄 Confirmação (`/confirmar`)  
3. ⭐ Avaliação dupla (`/avaliar`)  
4. 👑 Aprovação final pelas ADMs (`/aprovar`)  

👉 A negociação só é finalizada após ambas as partes avaliarem.

---

## 👤 Cadastro

No privado com o bot:

```
/cadastro
```

O usuário informa:

- nome  
- rede social (Instagram ou TikTok)  

👉 O cadastro é enviado para aprovação das ADMs.

---

## 🤖 Comandos principais

### Usuários

| Comando | Descrição |
|--------|--------|
| `/cadastro` | Inicia cadastro |
| `/negociacao @usuario` | Inicia negociação (no grupo) |
| `/confirmar ID` | Confirma negociação |
| `/avaliar ID nota comentario` | Avalia usuário |
| `/perfil @usuario` | Consulta reputação |
| `/denunciar @usuario motivo` | Envia denúncia (privado) |
| `/excluir_conta` | Solicita exclusão |

---

### Administradoras

| Comando | Descrição |
|--------|--------|
| `/aprovar_usuario NUMERO` | Aprova cadastro |
| `/rejeitar_usuario NUMERO` | Rejeita cadastro |
| `/aprovar ID` | Finaliza negociação |
| `/aprovar_exclusao NUMERO` | Aprova exclusão |

---

## 🔐 Segurança

O sistema possui:

- identificação por número real  
- validação de rede social  
- confirmação dupla  
- avaliação dupla obrigatória  
- aprovação final pelas ADMs  
- sistema de denúncias  
- controle de exclusão  

---

## 🧱 Arquitetura

```
WhatsApp → Baileys (Node.js) → FastAPI → SQLite
```

---

## 🛠️ Tecnologias utilizadas

### Backend
- Python  
- FastAPI  
- Pydantic  

### Bot
- Node.js  
- Baileys  
- Axios  

### Banco de dados
- SQLite  

### Infraestrutura
- Render  
- GitHub  

---

## 📁 Estrutura do projeto

```
backend/
  ├── main.py
  ├── database.py
  └── requirements.txt

bot/
  ├── index.js
  ├── package.json
  └── auth/
```

---

## ⚙️ Instalação

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 🔹 Bot (Node.js)

```bash
cd bot
npm install
node index.js
```

### 🔹 Login no WhatsApp

- escaneie o QR code no terminal  
- mantenha o bot rodando  

---

## ☁️ Deploy

### Backend (Render)

1. Suba o código no GitHub  
2. Conecte ao Render  
3. Configure:

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 10000
```

---

## 📊 Banco de dados

SQLite com tabelas:

- `usuarios`  
- `negociacoes`  
- `avaliacoes`  
- `config`  

---

## 🚨 Limitações atuais

- uso de API não oficial (Baileys)  
- depende do WhatsApp Web  
- bot precisa estar online  

---

## 🚀 Melhorias futuras

- alerta de conflito de avaliações  
- ranking de usuários  
- múltiplos grupos dinâmicos  
- integração com WhatsApp API oficial  
- painel administrativo  

---

## ⚖️ Privacidade (LGPD)

- dados usados apenas para funcionamento do sistema  
- usuário pode solicitar exclusão  
- exclusão depende de aprovação das ADMs  

---

## 💡 Uso recomendado

Antes de comprar:

```
/perfil @usuario
```

---

## 💖 Welovers

Mais segurança, mais confiança, mais amor nas negociações ✨
