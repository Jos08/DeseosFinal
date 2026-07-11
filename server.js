const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar/crear la base de datos SQLite
const db = new sqlite3.Database('./regalos.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado a la base de datos SQLite.');
});

// Crear la tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS deseos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    articulo TEXT NOT NULL,
    ocasion TEXT NOT NULL,
    precio_estimado REAL,
    prioridad TEXT CHECK(prioridad IN ('alta', 'media', 'baja')),
    reservado INTEGER DEFAULT 0,
    reservado_por TEXT
)`);

// 1. GET /deseos (Opcional filtrar por prioridad)
app.get('/deseos', (req, res) => {
    const { prioridad } = req.query;
    if (prioridad) {
        db.all('SELECT * FROM deseos WHERE prioridad = ?', [prioridad], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        db.all('SELECT * FROM deseos', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

// 2. POST /deseos
app.post('/deseos', (req, res) => {
    const { articulo, ocasion, precio_estimado, prioridad } = req.body;
    const query = `INSERT INTO deseos (articulo, ocasion, precio_estimated, prioridad) VALUES (?, ?, ?, ?)`;
    // Nota: El PDF define precio_estimado en la tabla
    db.run(`INSERT INTO deseos (articulo, ocasion, precio_estimado, prioridad) VALUES (?, ?, ?, ?)`, 
    [articulo, ocasion, precio_estimado, prioridad], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, articulo, ocasion, precio_estimado, prioridad, reservado: 0 });
    });
});

// 3. PUT /deseos/:id (Edición normal)
app.put('/deseos/:id', (req, res) => {
    const { articulo, ocasion, precio_estimado, prioridad } = req.body;
    db.run(`UPDATE deseos SET articulo = ?, ocasion = ?, precio_estimado = ?, prioridad = ? WHERE id = ?`,
    [articulo, ocasion, precio_estimado, prioridad, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Artículo actualizado con éxito" });
    });
});

// 4. RETO ADICIONAL: PUT /deseos/:id/reservar (Solo cambia reservado y reservado_por)
app.put('/deseos/:id/reservar', (req, res) => {
    const { reservado, reservado_por } = req.body; // reservado debe ser 1 o 0
    db.run(`UPDATE deseos SET reservado = ?, reservado_por = ? WHERE id = ?`,
    [reservado, reservado_por, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Estado de reserva actualizado" });
    });
});

// 5. DELETE /deseos/:id
app.delete('/deseos/:id', (req, res) => {
    db.run(`DELETE FROM deseos WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Artículo eliminado" });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));