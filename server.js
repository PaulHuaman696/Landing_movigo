require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas conectado'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definimos un esquema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Endpoint para recibir datos
app.post('/api/register', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newUser = new User({ name, email, phone });
    await newUser.save();
    res.json({ message: "¡Registro exitoso! Te contactaremos pronto." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el registro." });
  }
});

// Servir la landing estática
app.use(express.static('public'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
