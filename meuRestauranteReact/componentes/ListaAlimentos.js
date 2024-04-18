// ListaAlimentos.js

// Lista de pratos individuais na carta
export const carta = [
    { id: 1, name: 'Prato 1', category: 'prato', price: 5 /*, image: require('./path/to/image.jpg')*/ },
    { id: 2, name: 'Prato 2', category: 'prato', price: 8 /*, image: require('./path/to/image.jpg')*/ },
    { id: 3, name: 'Prato 3', category: 'prato', price: 12 /*, image: require('./path/to/image.jpg')*/ },
    { id: 4, name: 'Prato 4', category: 'prato', price: 10 /*, image: require('./path/to/image.jpg')*/ },
    { id: 5, name: 'Prato 5', category: 'prato', price: 15 /*, image: require('./path/to/image.jpg')*/ },
    { id: 6, name: 'Prato 6', category: 'prato', price: 9 /*, image: require('./path/to/image.jpg')*/ },
    { id: 7, name: 'Prato 7', category: 'prato', price: 11 /*, image: require('./path/to/image.jpg')*/ },
    { id: 8, name: 'Prato 8', category: 'prato', price: 7 /*, image: require('./path/to/image.jpg')*/ },
    { id: 9, name: 'Prato 9', category: 'prato', price: 6 /*, image: require('./path/to/image.jpg')*/ },
    { id: 10, name: 'Prato 10', category: 'prato', price: 13 /*, image: require('./path/to/image.jpg')*/ },
  ];
  
  // Lista de menús
  export const menus = [
    {
      id: 1,
      name: 'Menú 1',
      items: [
        { name: 'Prato 1', category: 'prato' },
        { name: 'Prato 2', category: 'prato' },
        { name: 'Postre 1', category: 'postre' },
        { name: 'Bebida 1', category: 'bebida' },
      ],
      price: 10,
      // image: require('./path/to/image.jpg') // Agrega a ruta á imaxe cando existan  
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
  