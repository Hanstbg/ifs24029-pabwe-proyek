const path = require('path');
const fs = require('fs');
const express = require('express');
const app = require('./app');

// Jika front-end sudah di-build (frontend/dist), sajikan dari server yang sama.
const dist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KARMA jalan di http://localhost:${PORT}`));
