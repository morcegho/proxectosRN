// const API_URL = 'http://localhost:3000/api/mesas'; 
const API_URL = 'http://192.168.0.20:3000/api/mesas'; // Cambia localhost pola IP do servidor se é necesario
// usar ipconfig e ver a ipv 4 192.168.137.1


// Obter todas as mesas
const obterMesas = async () => {
    try {
      const respuesta = await fetch(API_URL);
      return await respuesta.json();
    } catch (error) {
      console.error('Erro ao obter as mesas:', error);
      throw error;
    }
  };
  
  export { obterMesas };

// Crear unha nova mesa
const crearMesa = async (novaMesa) => {
  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaMesa),
    });
    console.log("mesa creada: "+novaMesa)
    return await resposta.json();
  } catch (error) {
    console.error('Erro ao crear a mesa:', error);
    throw error;
  }
};

// Actualizar unha mesa existente
const actualizarMesa = async (id, datosMesa) => {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosMesa),
    });
    console.log("mesa actualizada: "+ JSON.stringify(datosMesa))
    return await resposta.json();
  } catch (error) {
    console.error('Erro ao actualizar a mesa:', error);
    throw error;
  }
};

// Eliminar unha mesa existente
const eliminarMesa = async (id) => {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    console.log("mesa eliminada: "+ id)
    return await resposta.json();
  } catch (error) {
    console.error('Erro ao eliminar a mesa:', error);
    throw error;
  }
};

export { crearMesa, actualizarMesa, eliminarMesa };
