const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to file-based database
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'encuestas.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to save response
app.post('/api/encuesta', (req, res) => {
  try {
    const { nombre, telefono, r1, r2, r3, r4, r5, r6 } = req.body;

    // Validate that required answers are present (r1 is required, others can be empty/optional but let's accept what is sent)
    if (r1 === undefined) {
      return res.status(400).json({ error: 'La respuesta 1 (r1) es requerida.' });
    }

    // Load existing data
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const encuestas = JSON.parse(fileData);

    // Create new survey entry
    const newEncuesta = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      fecha: new Date().toISOString(),
      nombre: nombre || '',
      telefono: telefono || '',
      r1: r1,
      r2: r2 || '',
      r3: r3 || '',
      r4: r4 || [], // Can be array since it allows choosing up to 2 options
      r5: r5 || '',
      r6: r6 || ''
    };

    encuestas.push(newEncuesta);

    // Save back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(encuestas, null, 2), 'utf8');

    return res.status(201).json({ success: true, message: 'Encuesta guardada con éxito.', data: newEncuesta });
  } catch (error) {
    console.error('Error al guardar la encuesta:', error);
    return res.status(500).json({ error: 'Hubo un error en el servidor al guardar la encuesta.' });
  }
});

// API Endpoint to get all responses (for admin/monitoring purposes)
app.get('/api/encuesta', (req, res) => {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const encuestas = JSON.parse(fileData);
    return res.json(encuestas);
  } catch (error) {
    console.error('Error al leer las encuestas:', error);
    return res.status(500).json({ error: 'Hubo un error en el servidor al leer las encuestas.' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado y escuchando en http://localhost:${PORT}`);
});
