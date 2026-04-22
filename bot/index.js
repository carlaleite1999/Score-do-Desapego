import makeWASocket, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} from '@whiskeysockets/baileys'

import axios from 'axios'
import qrcode from 'qrcode-terminal'

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['MacOS', 'Chrome', '10.0']
    })

    // salvar sessão
    sock.ev.on('creds.update', saveCreds)

    // conexão
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        // QR Code
        if (qr) {
            console.log("📱 Escaneie o QR Code:")
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'open') {
            console.log("✅ Conectado ao WhatsApp!")
        }

        // reconexão automática
        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            console.log("⚠️ Conexão fechada. Reconectando...")

            if (shouldReconnect) {
                startBot()
            }
        }
    })

    // mensagens recebidas
    sock.ev.on('messages.upsert', async (msg) => {
        try {
            const m = msg.messages[0]

            if (!m.message) return

            // 🚨 evita loop infinito (ESSENCIAL)
            if (m.key.fromMe) return

            const numero = m.key.remoteJid

            const texto =
                m.message?.conversation ||
                m.message?.extendedTextMessage?.text ||
                m.message?.imageMessage?.caption ||
                m.message?.videoMessage?.caption

            if (!texto) return

            console.log("📩 Mensagem:", texto)

            // 🚫 evita responder respostas do próprio bot/backend
            if (texto === "Não entendi 🤔") return

            // chamada para seu backend (Render)
            const response = await axios.post(
                "https://score-do-desapego.onrender.com/webhook",
                {
                    message: texto,
                    phone: numero
                }
            )

            const reply = response.data.reply || "Erro ao processar 😢"

            // pequena pausa (evita rate limit)
            await new Promise(resolve => setTimeout(resolve, 800))

            // enviar resposta
            await sock.sendMessage(numero, { text: reply })

        } catch (error) {
            console.log("❌ Erro:", error.message)
        }
    })
}

// iniciar bot
startBot()