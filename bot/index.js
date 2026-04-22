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
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    // conexão
    sock.ev.on('connection.update', (update) => {
        const { connection, qr, lastDisconnect } = update

        if (qr) {
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'open') {
            console.log('✅ Conectado ao WhatsApp!')
        }

        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            console.log('❌ Conexão fechada. Reconectando...', shouldReconnect)

            if (shouldReconnect) {
                startBot()
            }
        }
    })

    // mensagens
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]

        if (!m.message) return
        if (m.key.fromMe) return

        const numero = m.key.remoteJid
        const isGroup = numero.endsWith('@g.us')

        // 🔥 CORREÇÃO DEFINITIVA DO SENDER
        let sender = numero

        if (isGroup) {
            sender =
                m.key.participant ??
                m.message?.extendedTextMessage?.contextInfo?.participant ??
                numero
        }

        const texto =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            ''

        if (!texto) return

        console.log('📩 Mensagem:', texto)
        console.log('👤 Sender:', sender)
        console.log('💬 Chat:', numero)
        console.log('👥 Grupo?', isGroup)

        try {
            const response = await axios.post(
                "https://score-do-desapego.onrender.com/webhook",
                {
                    message: texto,
                    phone: sender,   // 🔥 sempre válido agora
                    isGroup: isGroup,
                    chatId: numero
                }
            )

            const reply = response.data.reply

            if (!reply) return

            // evita rate limit
            await new Promise(resolve => setTimeout(resolve, 800))

            // 🔥 ESSENCIAL PRA RESPONDER EM GRUPO
            await sock.sendMessage(
                numero,
                { text: reply },
                { quoted: m }
            )

        } catch (error) {
            console.log('❌ Erro API:', error.response?.data || error.message)
        }
    })
}

startBot()