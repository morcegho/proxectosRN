// ListaAlimentos.js

// Lista de pratos individuais na carta
export const carta = [
    { id: 1, name: 'Prato 1', category: 'prato', price: 5 , image: require('../assets/imaxes/comida/comida1.png') },
    { id: 2, name: 'Prato 2', category: 'prato', price: 8 , image: require('../assets/imaxes/comida/comida2.png') },
    { id: 3, name: 'Prato 3', category: 'prato', price: 12 , image: require('../assets/imaxes/comida/comida3.png') },
    { id: 4, name: 'Prato 4', category: 'prato', price: 10 , image: require('../assets/imaxes/comida/comida4.png') },
    { id: 5, name: 'Prato 5', category: 'prato', price: 15 , image: require('../assets/imaxes/comida/comida5.png') },
    { id: 6, name: 'Prato 6', category: 'prato', price: 9 , image: require('../assets/imaxes/comida/comida6.png') },
    { id: 7, name: 'Prato 7', category: 'prato', price: 11 , image: require('../assets/imaxes/comida/comida7.png') },
    { id: 8, name: 'Prato 8', category: 'prato', price: 7 , image: require('../assets/imaxes/comida/comida8.png') },
    { id: 9, name: 'Prato 9', category: 'prato', price: 6 , image: require('../assets/imaxes/comida/comida9.png') },
    // { id: 10, name: 'Prato 10', category: 'prato', price: 13 , image: require('../assets/imaxes/comida/comida10.png') },
    // { id: 11, name: 'Prato 11', category: 'prato', price: 10 , image: require('../assets/imaxes/comida/comida11.png') },
    // { id: 12, name: 'Prato 12', category: 'prato', price: 8 , image: require('../assets/imaxes/comida/comida12.png') },

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
      image: require('../assets/imaxes/menu1.jpg'),
    },
    {
      id: 2,
      name: 'Menú 2',
      items: [
        { name: 'Prato 1', category: 'prato' },
        { name: 'Prato 2', category: 'prato' },
        { name: 'Postre 1', category: 'postre' },
        { name: 'Bebida 1', category: 'bebida' },
      ],
      price: 10,
      image: require('../assets/imaxes/menu2.jpg'),
      
 // Agrega a ruta á imaxe cando existan  
    }, {
      id: 3,
      name: 'Menú 3',
      items: [
        { name: 'Prato 1', category: 'prato' },
        { name: 'Prato 2', category: 'prato' },
        { name: 'Postre 1', category: 'postre' },
        { name: 'Bebida 1', category: 'bebida' },
      ],
      price: 10,
      image: require('../assets/imaxes/menu3.jpg'),
      
 // Agrega a ruta á imaxe cando existan  
    },
    // más menús 
  ];
  
  // Lista de bebidas
  export const bebidas = [
    { id: 1, name: 'Bebida 1', category: 'bebida', price: 2 , image: require('../assets/imaxes/bebidas/bebida1.png') },
    { id: 2, name: 'Bebida 2', category: 'bebida', price: 3, image: require('../assets/imaxes/bebidas/bebida2.png')},
    { id: 3, name: 'Bebida 3', category: 'bebida', price: 4 , image: require('../assets/imaxes/bebidas/bebida3.png') },
    { id: 4, name: 'Bebida 4', category: 'bebida', price: 2.5 , image: require('../assets/imaxes/bebidas/bebida4.png')},
    { id: 5, name: 'Bebida 5', category: 'bebida', price: 3.5, image: require('../assets/imaxes/bebidas/bebida5.png')},
    { id: 6, name: 'Bebida 6', category: 'bebida', price: 4.5, image: require('../assets/imaxes/bebidas/bebida6.png') },
    { id: 7, name: 'Bebida 7', category: 'bebida', price: 2.25 , image: require('../assets/imaxes/bebidas/bebida7.png') },
    { id: 8, name: 'Bebida 8', category: 'bebida', price: 3.25 , image: require('../assets/imaxes/bebidas/bebida8.png')},
    { id: 9, name: 'Bebida 9', category: 'bebida', price: 4.25 , image: require('../assets/imaxes/bebidas/bebida9.png')},
    // { id: 10, name: 'Bebida 10', category: 'bebida', price: 2.75 , image: require('../assets/imaxes/bebidas/bebida10.png') },
    // { id: 11, name: 'Bebida 11', category: 'bebida', price: 2.75 , image: require('../assets/imaxes/bebidas/bebida11.png') },
    // { id: 12, name: 'Bebida 11', category: 'bebida', price: 2.75 , image: require('../assets/imaxes/bebidas/bebida12.png') },

  ];
  