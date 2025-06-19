export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Simulate toggling power status on the digital twin (e.g., flip ON/OFF)
  console.log(`🔄 Power toggled for twin: ${req.query.twinId}`);

  return res.status(200).json({ message: `Power toggled for ${req.query.twinId}` });
}