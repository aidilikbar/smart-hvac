// /api/publisher-control.js
import { exec, spawn } from 'child_process';

let publisherProcess = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  if (action === 'start') {
    if (publisherProcess) {
      return res.status(200).json({ message: 'Publisher already running' });
    }

    publisherProcess = spawn('node', ['scripts/publisher.js'], {
      cwd: process.cwd(),
      stdio: 'ignore',
      detached: true
    });

    publisherProcess.unref();
    return res.status(200).json({ message: 'Publisher started' });
  }

  if (action === 'stop') {
    if (!publisherProcess) {
      return res.status(200).json({ message: 'Publisher is not running' });
    }

    process.kill(publisherProcess.pid);
    publisherProcess = null;
    return res.status(200).json({ message: 'Publisher stopped' });
  }

  return res.status(400).json({ error: 'Invalid action' });
}