// IMPORTS
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Creo el srvidor
const app = express();

// Configurar
app.use(cors());
app.use(express.json());

// Inicio el servidor
const port = 4000;
app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

// Me conecto a la base de datos
async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false // Cambiado a false para aceptar el certificado de Aiven (te explicaré esto en el readme xq ha sido una buena movida que me ha costado entender un buen rato)
    }
  });

  await connection.connect();
  console.log("Conectado a la base de datos de aiven");
  return connection;
}

// ENDPOINTS

// GET para  Obtener todos los libros
app.get("/api/libros", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const query = "SELECT * FROM libros";
    const [result] = await connection.query(query);
    connection.end();

    res.status(200).json({
      count: result.length,
      results: result
    });
  } catch (error) {
    console.error("Error al obtener libros:", error);
    res.status(500).json({ message: "Error interno al obtener librs" });
  }
});
// GET: para obtener un libro por su ID
app.get("/api/libros/:id", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const { id } = req.params;
    const sql = "SELECT * FROM libros WHERE id = ?";
    const [result] = await connection.query(sql, [id]);
    connection.end();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Libro no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      result: result[0]
    });
  } catch (error) {
    console.error("Error al obtemer el libro por ID:", error);
    res.status(500).json({ message: "Error intrno al obtener libro" });
  }
});
// POST para añadir un nuevo libro
app.post("/api/libros", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const { titulo, autor, leido } = req.body;

    if (!titulo || !autor || leido === undefined) {
      return res.status(400).json({
        success: false,
        message: "Falta información: 'titulo', 'autor' y 'leido'"
      });
    }

    const sql = "INSERT INTO libros (titulo, autor, leido) VALUES (?, ?, ?)";
    const [result] = await connection.query(sql, [titulo, autor, leido]);
    connection.end();

    res.status(201).json({
      success: true,
      id: result.insertId
    });
  } catch (error) {
    console.error("Error al añadir libro:", error);
    res.status(500).json({ message: "Error interno al añadir libro" });
  }
});
// PUT para actualizar un libro que ya existe
app.put("/api/libros/:id", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const { id } = req.params;
    const { titulo, autor, leido } = req.body;

    if (!titulo || !autor || leido === undefined) {
      return res.status(400).json({
        success: false,
        message: "Falta información: 'titulo', 'autor' y 'leido'"
      });
    }

    const sql = "UPDATE libros SET titulo = ?, autor = ?, leido = ? WHERE id = ?";
    const [result] = await connection.query(sql, [titulo, autor, leido, id]);
    connection.end();

    res.status(200).json({
      success: true,
      message: "Libro actualizado correctamente"
    });
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    res.status(500).json({ message: "Error interno al actualizar libro" });
  }
});
// DELETE para eliminar un libro por su ID
app.delete("/api/libros/:id", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const { id } = req.params;

    const sql = "DELETE FROM libros WHERE id = ?";
    const [result] = await connection.query(sql, [id]);
    connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Libro no encontrado para eliminar"
      });
    }

    res.status(200).json({
      success: true,
      message: "Libro eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    res.status(500).json({ message: "Error interno al eliminar libro" });
  }
});





