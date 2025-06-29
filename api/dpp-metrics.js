const express = require('express');
const router = express.Router();
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

client.connect();

router.get('/', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT SUM(energy) AS total_energy, COUNT(timestamp) AS lifetime
      FROM telemetry
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching DPP metrics:", error);
    res.status(500).json({ error: 'Failed to fetch DPP metrics' });
  }
});

module.exports = router;