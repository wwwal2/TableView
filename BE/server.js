import http from 'node:http'
import { Pool } from 'pg'

const PORT = Number(process.env.PORT) || 3001
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const pool = new Pool({ connectionString: DATABASE_URL })

function sendJson(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(data)
}
async function getCountFromDb() {
  const result = await pool.query(
    'SELECT count_value FROM app_state WHERE id = $1',
    [1],
  )

  if (result.rowCount === 0) {
    throw new Error('app_state row with id=1 was not found')
  }

  return Number(result.rows[0].count_value)
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method === 'GET' && req.url === '/api/count') {
    try {
      const count = await getCountFromDb()
      sendJson(res, 200, { count })
    } catch (error) {
      console.error('Failed to read count from database:', error)
      sendJson(res, 500, {
        error: 'Failed to read count from database',
      })
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

async function start() {
  await pool.query('SELECT 1')
  server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to start API:', error)
  process.exit(1)
})
