import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Switch, TextInput, ImageBackground } from 'react-native';
import { obterMesas, crearMesa, actualizarMesa, eliminarMesa } from './DatabaseConnect';
import { carta, menus, bebidas } from './ListaAlimentos'; // Importamos las listas de alimentos
import Icon from 'react-native-vector-icons/FontAwesome';

// Nuevo componente para el modal de mesas disponibles
function ModalMesasDisponibles({ visible, onClose, mesas, onSelectMesa, numComensales }) {
  // Filtrar las mesas según la capacidad
  const mesasFiltradas = mesas.filter(mesa => mesa.capacidad >= numComensales);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Mesas Disponibles</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
            {/* Renderizar las mesas filtradas en dos columnas */}
            {mesasFiltradas.map((mesa, index) => (
              <TouchableOpacity
                key={mesa.id}
                style={[styles.gridItem, index % 2 === 1 && styles.gridItemRight]}
                onPress={() => {
                  onSelectMesa(mesa);
                  onClose();
                }}
              >
                <Text style={styles.itemName}>Mesa {mesa.id}</Text>
                <Text style={styles.itemPrice}>Capacidad: {mesa.capacidad}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}


// En la función Menu(), dentro de handleSeleccionarMesa()
const handleSeleccionarMesa = async () => {
  try {
    const mesasDisponibles = await consultarMesasDisponibles();
    if (mesasDisponibles.length > 0) {
      setMesasDisponibles(mesasDisponibles); // Actualiza el estado con las mesas disponibles
      setModalVisible(true); // Muestra el modal con las mesas disponibles
    } else {
      console.log('No hay mesas disponibles.');
      // Manejar el caso en que no haya mesas disponibles
    }
  } catch (error) {
    console.error('Error al seleccionar la mesa:', error);
    // Manejo de errores
  }
};




// Componente para el contenido del modal de "Carta" y "Bebidas" (reutilizado)
function ModalCartaBebidas({ visible, onClose, addToOrder, data, title }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemPress = (item) => {
    const updatedItems = [...selectedItems];
    const index = updatedItems.findIndex((selectedItem) => selectedItem.id === item.id);
    if (index === -1) {
      updatedItems.push(item);
    } else {
      updatedItems.splice(index, 1);
    }
    setSelectedItems(updatedItems);
  };

  const handleConfirm = () => {
    addToOrder(selectedItems);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, selectedItems.some((selectedItem) => selectedItem.id === item.id) && styles.selectedItem]}
                onPress={() => handleItemPress(item)}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function Menu() {
  const [currentPantalla, setCurrentPantalla] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [terraza, setTerraza] = useState(false);
  const [numComensales, setNumComensales] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  // En la función Menu(), antes del return()
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    async function obterContidoBase() {
      try {
        const mesas = await obterMesas();
        console.log('Contenido de la base de datos:', mesas);
      } catch (error) {
        console.error('Error al obtener el contenido de la base de datos:', error);
      }
    }

    obterContidoBase();
  }, []);


  const consultarMesasDisponibles = async () => {
    try {
      const mesasLibres = await verificarDisponibilidadMesas(); // Utiliza mesasLibres en lugar de mesasDisponibles

      // Devolver las mesas libres encontradas
      console.log('Mesas disponibles:', mesasLibres);
      return mesasLibres;
    } catch (error) {
      console.error('Error al consultar las mesas disponibles:', error);
      return [];
    }
  };

  const verificarDisponibilidadMesas = async () => {
    try {
      // Lista de mesas buscadas
      const mesasBuscadas = [
        { id: 1, capacidad: 2 },
        { id: 2, capacidad: 3 },
        { id: 3, capacidad: 5 },
        { id: 4, capacidad: 6 },
        { id: 5, capacidad: 3, terraza: true },
        { id: 6, capacidad: 4, terraza: true },
        { id: 7, capacidad: 5, terraza: true },
      ];

      // Obtener todas las mesas de la base de datos
      const mesasDisponibles = await obterMesas();

      // Verificar disponibilidad de cada mesa buscada
      const mesasLibres = mesasBuscadas.filter(mesaBuscada => {
        const mesaEncontrada = mesasDisponibles.find(mesa => mesa.id === mesaBuscada.id);
        // Si la mesa no está ocupada o no se encuentra en la base de datos, está disponible
        return !mesaEncontrada || !mesaEncontrada.ocupada;
      });

      // Devolver las mesas libres encontradas
      return mesasLibres;
    } catch (error) {
      console.error('Error al verificar la disponibilidad de mesas:', error);
      return [];
    }
  };

  const handleMenuPress = (pantalla) => {
    setCurrentPantalla(pantalla);
  };

  const addToOrder = (items) => {
    const newPedido = [...pedido, ...items];
    setPedido(newPedido);
    const totalPrice = items.reduce((total, item) => total + item.price, 0);
    setTotalGastado(totalGastado + totalPrice);
  };

  const removeFromOrder = (index) => {
    const removedItem = pedido[index];
    const newPedido = pedido.filter((item, i) => i !== index);
    setPedido(newPedido);
    setTotalGastado(totalGastado - removedItem.price);
  };



  const handleTerrazaChange = (value) => {
    setTerraza(value);
  };

  const handleSeleccionarMesa = async (mesa) => {
    try {
      await actualizarMesa(mesa.id, { estado: 'Reservada' }); // Actualizar el estado de la mesa en la base de datos
      setMesaSeleccionada({ ...mesa, estado: 'Reservada' });
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
    // };
    // const handleSeleccionarMesa = async () => {
    try {
      const mesasDisponibles = await consultarMesasDisponibles();
      const mesasDisponiblesParaComensales = mesasDisponibles.filter(mesa => mesa.capacidad >= parseInt(numComensales));

      if (mesasDisponiblesParaComensales.length > 0) {
        setMesasDisponibles(mesasDisponibles); // Actualiza el estado con las mesas disponibles
        console.log("Mesas dispoñibles totais:", mesasDisponibles);
        console.log('Mesas disponibles para el número de comensais:', mesasDisponiblesParaComensales);

        // Agregar este console.log para verificar las mesas disponibles
        setModalVisible(true); // Muestra el modal con las mesas disponibles
      } else {
        console.log('No hay mesas disponibles.');
        // Manejar el caso en que no haya mesas disponibles
      }
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
      // Manejo de errores
    }
    try {
      // Crear una nueva mesa en la base de datos
      const nuevaMesa = {
        numero: mesaSeleccionada.numero,
        prazas: mesaSeleccionada.plazas,
        ocupada: true,
        cliente: null,
        pedido: [],
        prezoTotal: 0,
        pagado: false,
        terraza: false,
        numComensais: 0,
        estado: "reservada"
      }
      const nuevaMesaCreada = await crearMesa(nuevaMesa);
      console.log('Nueva mesa creada:', nuevaMesaCreada);
      // Actualizar el estado de la mesa seleccionada
      setMesaSeleccionada(nuevaMesaCreada);
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
  };

  const handleLimparApp = async () => {
    setCurrentPantalla(null);
    setPedido([]);
    setTotalGastado(0);
    setMesaSeleccionada(null);
    setTerraza(false);
    setNumComensales('');
    try {
      // Eliminar la mesa seleccionada de la base de datos
      await eliminarMesa(mesaSeleccionada.id);
      console.log('Mesa eliminada:', mesaSeleccionada);
      // Limpiar el estado de la mesa seleccionada
      setMesaSeleccionada(null);
      setNumComensales('');
      // Otros estados a limpiar...
    } catch (error) {
      console.error('Error al limpiar la aplicación:', error);
    }
  };

  const handleNumComensalesChange = (text) => {
    setNumComensales(text);
    // Actualizar el número de comensales en la mesa seleccionada en la base de datos (si es necesario)
    if (mesaSeleccionada) {
      const nuevosDatosMesa = { ...mesaSeleccionada, numComensales: parseInt(text) };
      actualizarMesa(mesaSeleccionada.id, nuevosDatosMesa);
    }
  };
  const handlePagar = async () => {
    try {
      if (mesaSeleccionada) {
        // Cambiar el estado de la mesa a "pagado" y "ocupada = false" en la base de datos
        const mesaActualizada = { ...mesaSeleccionada, pagado: true, ocupada: false };
        await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
        console.log('Mesa marcada como "pagado" y "ocupada = false"');
      }
    } catch (error) {
      console.error('Error al pagar:', error);
    }
  };
  const handleConfirmarPedido = async () => {
    try {
      if (mesaSeleccionada) {
        // Cambiar el estado de la mesa a "servido" en la base de datos
        const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
        await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
        console.log('Estado de la mesa actualizado a "servido"');
      }
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    }
  };
  const obterTextoBoton = () => {
    return mesaSeleccionada ? `Mesa ${mesaSeleccionada.id} - ${mesaSeleccionada.estado}` : 'Ver Dispoñibles';
  };
  const getIconByType = (type) => {
    switch (type) {
      case 'bebida':
        return <IconBebida />;
      case 'comida':
        return <IconComida />;
      case 'menu':
        return <IconMenu />;
      default:
        return null;
    }
  };
  const IconComida = () => {
    return <Icon name="list-alt" />;
  };const IconBebida = () => {
    return <Icon name="glass" />;
  };const IconMenu = () => {
    return <Icon name="cutlery" />;
  };
  return (
    <ImageBackground>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Menús')}>
  <IconMenu width={24} height={24} />
  <Text style={styles.buttonText}>Menús</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Carta')}>
  <IconComida width={24} height={24} /> 
  <Text style={styles.buttonText}>Carta</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Bebidas')}>
  <IconBebida width={24} height={24} />
  <Text style={styles.buttonText}>Bebidas</Text>
</TouchableOpacity>
        </View>
        <View flexDirection="row">
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Terraza:</Text>
            <Switch value={terraza} onValueChange={handleTerrazaChange} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Número de comensais"
            keyboardType="numeric"
            value={numComensales}
            onChangeText={handleNumComensalesChange}
          />

        </View>


        <TouchableOpacity style={styles.button} onPress={handleSeleccionarMesa}>
          <Text style={styles.buttonText}>{obterTextoBoton()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLimparApp}>
          <Text style={styles.buttonText}>Limpar <Icon name="trash" /></Text>
        </TouchableOpacity>
        <View style={styles.pedidoContainer}>
  <Text style={styles.pedidoTitle}>Pedido:</Text>
  <ScrollView>
    {pedido.map((item, index) => (
      <View key={index} style={styles.pedidoItem}>
        {getIconByType(item.type)}
        <Text>{item.name}</Text>
        <Text>${item.price}</Text>
        <TouchableOpacity onPress={() => removeFromOrder(index)} style={styles.removeButton}>
          <Text><Icon name="times" /></Text>
        </TouchableOpacity>
      </View>
      
    ))}
     {pedido.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={handleConfirmarPedido}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      )}
  </ScrollView></View>

        <View style={styles.topBar}>
          <Text style={styles.gastadoText}>Gastado: ${totalGastado.toFixed(2)}</Text>
         
          {pedido.length > 0 && (
        <TouchableOpacity style={styles.verPedidoButton} onPress={handlePagar}>
          <Text style={styles.buttonText}>Pagar</Text>
        </TouchableOpacity>
      )}
        </View>
        {currentPantalla === 'Carta' && (
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} addToOrder={addToOrder} data={carta} title="Carta" />
        )}
        {currentPantalla === 'Bebidas' && (
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} addToOrder={addToOrder} data={bebidas} title="Bebidas" />
        )}
        {currentPantalla === 'Menús' && (
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} addToOrder={addToOrder} data={menus} title="Menús" />
        )}
        <ModalMesasDisponibles
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          mesas={mesasDisponibles}
          onSelectMesa={(mesa) => {
            setMesaSeleccionada(mesa);
            setModalVisible(false);
          }}
          numComensales={parseInt(numComensales)} // Pasar el número de comensales como prop
        />

      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gastadoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    // borderRadius: 10,
    //elevation: 1,
    marginHorizontal: 20,
    //paddingHorizontal: '10%',
    marginVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginHorizontal: 25,
  },
  verPedidoButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gridItem: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
  },
  selectedItem: {
    backgroundColor: 'lightblue',
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: 'green',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'lightgreen',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: 'salmon',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  pedidoContainer: {
    flex: 1,
    marginTop: 20,
  },
  pedidoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pedidoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  switchText: {
    fontSize: 18,
    marginRight: 10,
  },
  textInput: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});
