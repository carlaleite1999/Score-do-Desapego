import sqlite3

# 🔌 Conexão com o banco
def conectar():
    return sqlite3.connect("bot.db")


# 🧱 Criar todas as tabelas
def criar_tabelas():
    conn = conectar()
    cur = conn.cursor()

    # 👤 Usuários (preparado para futuro: badge, reputação etc)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nome TEXT,
        badge TEXT
    )
    """)

    # 🛍️ Negociações (COM confirmação dupla)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS negociacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario1 TEXT,
        usuario2 TEXT,
        confirmacao_usuario1 INTEGER DEFAULT 0,
        confirmacao_usuario2 INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pendente'
    )
    """)

    # ⭐ Avaliações (já preparada pro próximo passo)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS avaliacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        negociacao_id INTEGER UNIQUE,
        avaliador TEXT,
        avaliado TEXT,
        nota INTEGER,
        comentario TEXT,
        status TEXT DEFAULT 'pendente'
    )
    """)

    conn.commit()
    conn.close()