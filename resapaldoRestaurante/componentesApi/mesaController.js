const Mesa = require('./mesaModel');

// Obtener todas las mesas
exports.getMesas = async (req, res) => {
  try {
    const mesas = await Mesa.find();
    res.json(mesas);
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener una mesa polo ID
exports.getMesaById = async (req, res) => {
  try {
    const mesa = await Mesa.findById(req.params.id);
    res.json(mesa);
  } catch (error) {
    console.error('Error al obtener la mesa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nova mesa
// Crear nueva mesa
exports.createMesa = async (req, res) => {
  try {
    const nuevaMesa = new Mesa(req.body);
    await nuevaMesa.save();
    res.status(201).json(nuevaMesa);
  } catch (error) {
    console.error('Erro creando a mesa:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Actualizar unha mesa existente
// Actualizar unha mesa existente
exports.updateMesa = async (req, res) => {
  try {
    const mesaActualizada = await Mesa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(mesaActualizada);
  } catch (error) {
    console.error('Erro ao actualizar a mesa:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Eliminar una mesa existente
exports.deleteMesa = async (req, res) => {
  try {
    await Mesa.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mesa eliminada correctamente' });
  } catch (error) {
    console.error('Erro ao eliminar a mesa:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
