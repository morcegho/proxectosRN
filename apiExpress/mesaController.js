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

// Obtener una mesa por su ID
exports.getMesaById = async (req, res) => {
  try {
    const mesa = await Mesa.findById(req.params.id);
    res.json(mesa);
  } catch (error) {
    console.error('Error al obtener la mesa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear una nueva mesa
exports.createMesa = async (req, res) => {
  try {
    const nuevaMesa = new Mesa(req.body);
    await nuevaMesa.save();
    res.status(201).json(nuevaMesa);
  } catch (error) {
    console.error('Error al crear la mesa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar una mesa existente
exports.updateMesa = async (req, res) => {
  try {
    await Mesa.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Mesa actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la mesa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar una mesa existente
exports.deleteMesa = async (req, res) => {
  try {
    await Mesa.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mesa eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la mesa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
