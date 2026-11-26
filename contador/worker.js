// Contador de corações do site da Morgan (Cloudflare Worker + banco D1 ligado como "DB").
// GET  -> { total }
// POST com o número de toques no corpo (1 a 30) -> { total }
// Não guarda nada de quem tocou: só o total e, por 2 minutos, um código embaralhado
// do endereço para barrar robôs (no máximo 120 toques por minuto por pessoa).

const SITES = ['https://rosavitorina.github.io'];
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const MAX_POR_ENVIO = 30;
const MAX_POR_MINUTO = 120;
let pronto = false;

function cors(origin) {
  const ok = SITES.includes(origin) || LOCAL.test(origin || '') || origin === 'null';
  return {
    'Access-Control-Allow-Origin': ok ? origin : SITES[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(origin) },
  });
}

async function preparar(db) {
  if (pronto) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS contador (id TEXT PRIMARY KEY, n INTEGER NOT NULL)'),
    db.prepare("INSERT OR IGNORE INTO contador (id, n) VALUES ('coracoes', 0)"),
    db.prepare('CREATE TABLE IF NOT EXISTS limite (k TEXT PRIMARY KEY, n INTEGER NOT NULL, minuto INTEGER NOT NULL)'),
  ]);
  pronto = true;
}

async function total(db) {
  const row = await db.prepare("SELECT n FROM contador WHERE id = 'coracoes'").first();
  return row ? row.n : 0;
}

async function codigo(texto) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(bytes)].slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (!env.DB) return json({ erro: 'banco D1 não ligado (nome DB)' }, 500, origin);
    await preparar(env.DB);

    if (request.method === 'GET') return json({ total: await total(env.DB) }, 200, origin);
    if (request.method !== 'POST') return json({ erro: 'método' }, 405, origin);

    const n = parseInt((await request.text()).slice(0, 8), 10);
    if (!Number.isInteger(n) || n < 1 || n > MAX_POR_ENVIO) return json({ erro: 'número inválido' }, 400, origin);

    const minuto = Math.floor(Date.now() / 60000);
    const ip = request.headers.get('CF-Connecting-IP') || 'sem-ip';
    const k = await codigo(ip + '|' + minuto);
    const uso = await env.DB.prepare(
      'INSERT INTO limite (k, n, minuto) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET n = n + ?2 RETURNING n'
    ).bind(k, n, minuto).first();
    if (Math.random() < 0.05) await env.DB.prepare('DELETE FROM limite WHERE minuto < ?1').bind(minuto - 2).run();
    if (uso && uso.n > MAX_POR_MINUTO) return json({ erro: 'calma', total: await total(env.DB) }, 429, origin);

    const row = await env.DB.prepare("UPDATE contador SET n = n + ?1 WHERE id = 'coracoes' RETURNING n").bind(n).first();
    return json({ total: row ? row.n : 0 }, 200, origin);
  },
};
