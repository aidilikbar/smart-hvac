// scripts/controller-server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;
let publisherProcess = null;

app.use(cors());
app.use(express.static(path.join(__dirname, '../control-ui'))); // Serve UI files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/control/start', (req, res) => {
  if (publisherProcess) {
    return res.json({ message: 'HVAC already running.' });
  }

  publisherProcess = spawn('npm', ['run', 'publish-event'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit'
  });

  res.json({ message: 'HVAC started.' });
});

app.get('/control/stop', (req, res) => {
  if (publisherProcess) {
    publisherProcess.kill('SIGINT');
    publisherProcess = null;
    return res.json({ message: 'HVAC stopped.' });
  }
  res.json({ message: 'HVAC not running.' });
});

app.listen(port, () => {
  console.log(`✅ Controller server running at http://localhost:${port}`);
});