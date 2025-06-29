// api/dpp.js
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT * FROM dpp LIMIT 1');
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to fetch DPP:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}