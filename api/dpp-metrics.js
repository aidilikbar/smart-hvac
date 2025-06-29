// /api/dpp-metrics.js

import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();

    const sumQuery = 'SELECT SUM(energy) AS total_energy, COUNT(*) AS lifetime FROM telemetry';
    const result = await client.query(sumQuery);

    client.release();

    const totalEnergy = parseFloat(result.rows[0].total_energy).toFixed(2);
    const lifetime = parseInt(result.rows[0].lifetime, 10);

    res.status(200).json({
      energyConsumption: `${totalEnergy} kWh`,
      lifecycleCount: lifetime,
    });
  } catch (err) {
    console.error('Error fetching DPP metrics:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}