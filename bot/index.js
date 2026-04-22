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

            if (shouldReconnect) {
                startBot()
            }
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]

        if (!m.message) return
        if (m.key.fromMe) return

        const numero = m.key.remoteJid
        const isGroup = numero.endsWith('@g.us')

        const sender = isGroup
            ? m.key.participant
            : numero

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
                    phone: sender,   // 🔥 corrigido
                    isGroup: isGroup,
                    chatId: numero
                }
            )

            const reply = response.data.reply

            if (!reply) return

            await new Promise(resolve => setTimeout(resolve, 800))

            await sock.sendMessage(
                numero,
                { text: reply },
                { quoted: m } // 🔥 ESSENCIAL PRA GRUPO
            )

        } catch (error) {
            console.log('❌ Erro API:', error.response?.data || error.message)
        }
    })
}

startBot()