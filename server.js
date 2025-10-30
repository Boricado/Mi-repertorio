import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())
const PORT = 5500

// Reconstruir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta principal 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// Obtener todas las canciones
app.get('/canciones', (req, res) => {
  const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
  res.json(canciones)
})

// Agregar una nueva canción
app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body
  const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
  canciones.push(nuevaCancion)
  fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
  res.send('Canción agregada')
})

// Editar una canción
app.put('/canciones/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
  const index = canciones.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).send('Canción no encontrada')
  canciones[index] = req.body
  fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
  res.send('Canción actualizada')
})

// Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
  const index = canciones.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).send('Canción no encontrada')
  canciones.splice(index, 1)
  fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
  res.send('Canción eliminada')
})

//Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`)
})
