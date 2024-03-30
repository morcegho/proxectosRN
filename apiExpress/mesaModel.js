const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  capacidade: {
    type: Number,
    required: true
  },
  ocupada: {
    type: Boolean,
    default: false
  },
  cliente: {
    type: String,
    default: null
  },
  pedido: {
    type: Array,
    default: []
  },
  prezoTotal: {
    type: Number,
    default: 0
  },
  pagado: {
    type: Boolean,
    default: false
  },
  terraza: {
    type: Boolean,
    default: false
  },
  numComensais: {
    type: Number,
    default: 0
  },
  estado: {
    type: String,
    default: 'libre'
  }
});

const Mesa = mongoose.model('Mesa', mesaSchema);

module.exports = Mesa;

