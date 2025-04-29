require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const getPublicIPAddress = require('./src/utils/getIP');
const updateEnv = require('./src/utils/updateEnv');
const path = require('path');

(async () => {
  try {
    // 1. Intentar obtener IP pública (pero que no bloquee inicio si falla)
    let ip;
    try {
      ip = await getPublicIPAddress();
      if (ip) {
        updateEnv("IP_HOST", ip);
        process.env.IP_HOST = ip;
      }
    } catch (err) {
      console.error('Warning: no se pudo obtener IP pública:', err);
    }

    // 2. Crear app y middlewares
    const app = express();
    app.use(cors());
    app.use(express.json());

    // 3. Conexión a MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas conectado');

    // 4. Definir esquema y modelo
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      createdAt: { type: Date, default: Date.now }
    });
    const User = mongoose.model('User', UserSchema);

    // 5. Endpoints
    app.post('/api/register', async (req, res) => {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Faltan campos.' });
      }
      try {
        await new User({ name, email, phone }).save();
        res.json({ message: "¡Registro exitoso! Te contactaremos pronto." });
      } catch (error) {
        console.error('Error guardando usuario:', error);
        res.status(500).json({ message: "Error interno." });
      }
    });

    // 6. Servir estáticos
    app.use(express.static(path.join(__dirname, 'public')));

    // 7. Levantar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en http://${process.env.IP_HOST || 'localhost'}:${PORT}`);
    });

  } catch (e) {
    console.error('Error al iniciar la aplicación:', e);
    process.exit(1);
  }
})();
