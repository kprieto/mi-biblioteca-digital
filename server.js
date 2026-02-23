const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 1. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("¡Conectado exitosamente a Atlas!"))
    .catch(err => console.error("Error de conexión:", err));

// 2. Definición del Esquema
const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    isbn: String,
    genero: String,
    imagenUrl: { type: String, default: 'https://placehold.co/150?text=Sin+Portada' },
    fechaPublicacion: Date,
    disponible: { type: Boolean, default: true }
});

// 3. Definición del Modelo (Protegido contra sobrescritura)
// Usamos mongoose.models.Libro para reutilizarlo si ya existe
const Libro = mongoose.models.Libro || mongoose.model('Libro', libroSchema);



// --- RUTAS ---

// Ruta para obtener todos los libros (GET)
app.get('/api/libros', async (req, res) => {
    try {
        // Usamos la constante 'Libro' definida arriba, NO creamos un modelo nuevo aquí
        const libros = await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener libros", error });
    }
});

// Ruta para guardar un libro (POST)
app.post('/api/libros', async (req, res) => {
    try {
        // Usamos la constante 'Libro' definida arriba
        const nuevoLibro = new Libro(req.body);
        await nuevoLibro.save();
        res.status(201).json(nuevoLibro);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al guardar el libro", error });
    }
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));