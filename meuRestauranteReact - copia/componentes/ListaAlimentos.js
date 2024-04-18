// ListaAlimentos.js

// Lista de platos individuales en la carta
export const carta = [
    { id: 1, name: 'Plato 1', category: 'plato', price: 5 /*, image: require('./path/to/image.jpg')*/ },
    { id: 2, name: 'Plato 2', category: 'plato', price: 8 /*, image: require('./path/to/image.jpg')*/ },
    { id: 3, name: 'Plato 3', category: 'plato', price: 12 /*, image: require('./path/to/image.jpg')*/ },
    { id: 4, name: 'Plato 4', category: 'plato', price: 10 /*, image: require('./path/to/image.jpg')*/ },
    { id: 5, name: 'Plato 5', category: 'plato', price: 15 /*, image: require('./path/to/image.jpg')*/ },
    { id: 6, name: 'Plato 6', category: 'plato', price: 9 /*, image: require('./path/to/image.jpg')*/ },
    { id: 7, name: 'Plato 7', category: 'plato', price: 11 /*, image: require('./path/to/image.jpg')*/ },
    { id: 8, name: 'Plato 8', category: 'plato', price: 7 /*, image: require('./path/to/image.jpg')*/ },
    { id: 9, name: 'Plato 9', category: 'plato', price: 6 /*, image: require('./path/to/image.jpg')*/ },
    { id: 10, name: 'Plato 10', category: 'plato', price: 13 /*, image: require('./path/to/image.jpg')*/ },
  ];
  
  // Lista de menús
  export const menus = [
    {
      id: 1,
      name: 'Menú 1',
      items: [
        { name: 'Plato 1', category: 'plato' },
        { name: 'Plato 2', category: 'plato' },
        { name: 'Postre 1', category: 'postre' },
        { name: 'Bebida 1', category: 'bebida' },
      ],
      price: 10,
      // image: require('./path/to/image.jpg') // Agrega la ruta a la imagen cuando la tengas disponible
    },
    // Agrega más menús si es necesario
  ];
  
  // Lista de bebidas
  export const bebidas = [
    { id: 1, name: 'Bebida 1', category: 'bebida', price: 2 /*, image: require('./path/to/image.jpg')*/ },
    { id: 2, name: 'Bebida 2', category: 'bebida', price: 3 /*, image: require('./path/to/image.jpg')*/ },
    { id: 3, name: 'Bebida 3', category: 'bebida', price: 4 /*, image: require('./path/to/image.jpg')*/ },
    { id: 4, name: 'Bebida 4', category: 'bebida', price: 2.5 /*, image: require('./path/to/image.jpg')*/ },
    { id: 5, name: 'Bebida 5', category: 'bebida', price: 3.5 /*, image: require('./path/to/image.jpg')*/ },
    { id: 6, name: 'Bebida 6', category: 'bebida', price: 4.5 /*, image: require('./path/to/image.jpg')*/ },
    { id: 7, name: 'Bebida 7', category: 'bebida', price: 2.25 /*, image: require('./path/to/image.jpg')*/ },
    { id: 8, name: 'Bebida 8', category: 'bebida', price: 3.25 /*, image: require('./path/to/image.jpg')*/ },
    { id: 9, name: 'Bebida 9', category: 'bebida', price: 4.25 /*, image: require('./path/to/image.jpg')*/ },
    { id: 10, name: 'Bebida 10', category: 'bebida', price: 2.75 /*, image: require('./path/to/image.jpg')*/ },
  ];
  