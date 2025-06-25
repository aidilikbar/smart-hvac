// controller-server.js
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

let publisherProcess = null;

app.use(cors());

// Start publisher.js
app.get('/control/start', (req, res) => {
  if (publisherProcess) {
    return res.status(400).send('Publisher already running');
  }

  const scriptPath = path.join(__dirname, 'publisher.js');
  publisherProcess = spawn('node', [scriptPath], { stdio: 'inherit' });

  console.log('✅ Publisher started');
  res.send('Publisher started');
});

// Stop publisher.js
app.get('/control/stop', (req, res) => {
  if (!publisherProcess) {
    return res.status(400).send('Publisher not running');
  }

  publisherProcess.kill('SIGINT');
  publisherProcess = null;

  console.log('🛑 Publisher stopped');
  res.send('Publisher stopped');
});

app.listen(PORT, () => {
  console.log(`🛠️ Controller server running at http://localhost:${PORT}`);
});