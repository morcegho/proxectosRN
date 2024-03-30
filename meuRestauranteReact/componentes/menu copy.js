import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Switch, TextInput, ImageBackground, StatusBar } from 'react-native';
import { obterMesas, crearMesa, actualizarMesa, eliminarMesa } from './DatabaseConnect';
import { carta, menus, bebidas } from './ListaAlimentos';
import Icon from 'react-native-vector-icons/FontAwesome';

function ModalMesasDisponibles({ visible, onClose, mesas, onSelectMesa, numComensais }) {
  const mesasFiltradas = mesas.filter(mesa => mesa.capacidad >= numComensais);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Mesas Dispoñibles</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
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
                <Text style={styles.itemPrice}>Capacidade: {mesa.capacidad}</Text>
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

function ModalCartaBebidas({ visible, onClose, addToOrder, data, title }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemPress = (item) => {
    const updatedItems = selectedItems.includes(item) ? selectedItems.filter(selectedItem => selectedItem !== item) : [...selectedItems, item];
    setSelectedItems(updatedItems);
  };

  const handleConfirm = () => {
    addToOrder(selectedItems);
    onClose();
  };

  return (
  <Modal visible={visible} animationType="slide">
<View style={[styles.modalContainer, styles.centeredModal]}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{title}</Text>
      <ScrollView>
        <View style={styles.gridContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, selectedItems.includes(item) && styles.selectedItem]}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} €</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.buttonText}>Confirmar <Icon name="check" size={20} color="green"/></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancelar <Icon name="times" size={20} color="red" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

  );
}

export default function Menu() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPantalla, setCurrentPantalla] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [terraza, setTerraza] = useState(false);
  const [numComensais, setNumComensais] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const isCrearDisabled = !terraza || isNaN(parseInt(numComensais)) || parseInt(numComensais) <= 0 || !mesaSeleccionada;
const isPagarVisible = mesaSeleccionada && mesaSeleccionada.estado === 'servido';

  useEffect(() => {
    async function obterContidoBase() {
      try {
        const mesas = await obterMesas();
        console.log('Contido da base de datos:', mesas);
      } catch (error) {
        console.error('Erro ao obter o contido da base de datos:', error);
      }
    }

    obterContidoBase();
  }, []);
  const consultarMesasDisponibles = async () => {
    try {
      const mesasLibres = await verificarDisponibilidadMesas(); // Utiliza mesasLibres en lugar de mesasDisponibles

      // Devolver as mesas libres encontradas
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

      // Obter todas as mesas da base de datos
      const mesasDisponibles = await obterMesas();

      // Verificar dispoñibilidade de cada mesa buscada
      const mesasLibres = mesasBuscadas.filter(mesaBuscada => {
        const mesaEncontrada = mesasDisponibles.find(mesa => mesa.id === mesaBuscada.id);
        // Se non está ocupada ou non se atopa na base de datos, está dispoñible
        return !mesaEncontrada || !mesaEncontrada.ocupada;
      });

      // Devolver as mesas libres encontradas
      return mesasLibres;
    } catch (error) {
      console.error('Erro ao verificar a dispoñibilidade de mesas:', error);
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
  
  // const handleSeleccionarMesa = async () => {
  //   try {
  //     const mesasDispoñibles = await consultarMesasDisponibles();
  //     if (mesasDisponibles.length > 0) {
  //       setMesasDisponibles(mesasDispoñibles);
  //       setModalVisible(true);
  //     } else {
  //       console.log('Non hai mesas dispoñibles.');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao seleccionar a mesa:', error);
  //   }
  // };
const handleCrearMesa = async () => {
  try {
    const novaMesa = await crearMesa({
      id: mesaSeleccionada ? mesaSeleccionada.id : null, // Se xa hai unha mesa seleccionada, usa o seu ID
      capacidad: parseInt(numComensais),
      terraza: terraza,
      ocupada: mesaSeleccionada ? mesaSeleccionada.ocupada : true, // Se hai mesa seleccionada, se mantén o estado de ocupación
      pagado: false,
      estado: 'reservada', // Establece o estado como "reservada" ao crear unha nova mesa
    });
    setMesaSeleccionada(novaMesa);
  } catch (error) {
    console.error('Erro ao crear a mesa:', error);
  }
};

const handleSeleccionarMesa = async () => {
  try {
    if (!mesaSeleccionada) {
      const mesasDisponibles = await consultarMesasDisponibles();
      if (mesasDisponibles.length > 0) {
        setMesasDisponibles(mesasDisponibles);
        setModalVisible(true);
      } else {
        console.log('Non hai mesas dispoñibles.');
      }
    } else {
      const mesasDisponibles = await consultarMesasDisponibles();
      if (mesasDisponibles.length > 0) {
        setMesasDisponibles(mesasDisponibles);
        setModalVisible(true);
        // Non se restablecen  valores da mesa seleccionada se xa está creada
      } else {
        console.log('Non hai mesas dispoñibles.');
      }
    }
  } catch (error) {
    console.error('Erro ao seleccionar a mesa:', error);
  }
};

const handleConfirmarPedido = async () => {
  try {
    if (mesaSeleccionada) {
      const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
      await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
      console.log('Estado da mesa actualizado a "servido"');
    } else {
      alert('Debe seleccionar unha mesa antes de confirmar o pedido');
    }
  } catch (error) {
    console.error('Erro ao confirmar o pedido:', error);
  }
};

const handlePagar = async () => {
  try {
    if (mesaSeleccionada) {
      const mesaActualizada = { ...mesaSeleccionada, pagado: true, ocupada: false, estado: 'libre' };
      await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
      console.log('Mesa marcada como "pagada" e "libre" con ocupada = false');
    } else {
      alert('Debe seleccionar unha mesa antes de pagar');
    }
  } catch (error) {
    console.error('Erro ao pagar:', error);
  }
};


// const handleConfirmarPedido = async () => {
//   try {
//     if (!mesaSeleccionada) {
//       // Mostrar una alerta si no hay una mesa seleccionada
//       alert('Debe seleccionar una mesa antes de confirmar el pedido');
//       return;
//     }

//     const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
//     await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
//     console.log('Estado de la mesa actualizado a "servido"');
//   } catch (error) {
//     console.error('Error al confirmar el pedido:', error);
//   }
// };
const handleLimparApp = async () => {
  setCurrentPantalla(null); // Reinicia a pantalla actual
  setPedido([]); // Reinicia o pedido
  setTotalGastado(0); // Reinicia o total gastado
  try {
    // Se hai unha mesa seleccionada, elimina
    if (mesaSeleccionada) {
      await eliminarMesa(mesaSeleccionada.id); // Elimina a mesa seleccionada
      console.log('Mesa eliminada:', mesaSeleccionada);
    }
    setMesaSeleccionada(null); // Reinicia a mesa seleccionada
    setTerraza(false); // Reinicia o estado de terraza
    setNumComensais(''); // Reinicia o número de comensais
  } catch (error) {
    console.error('Erro ao limpar a aplicación:', error);
  }
};


  const handleNumComensaisChange = (text) => {
    setNumComensais(text);
    if (mesaSeleccionada) {
      const novosDatosMesa = { ...mesaSeleccionada, numComensais: parseInt(text) };
      actualizarMesa(mesaSeleccionada.id, novosDatosMesa);
    }
  };

  // const handlePagar = async () => {
  //   try {
  //     if (mesaSeleccionada) {
  //       const mesaActualizada = { ...mesaSeleccionada, pagado: true, ocupada: false };
  //       await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
  //       console.log('Mesa marcada como "pagado" e "ocupada = false"');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao pagar:', error);
  //   }
  // };


  const obterTextoBoton = () => mesaSeleccionada ? `Mesa ${mesaSeleccionada.id} - ${mesaSeleccionada.estado}` : 'Ver Dispoñibles';

  const getIconByType = (type) => {
    switch (type) {
      case 'bebida':
        return <Icon name="glass" />;
      case 'comida':
        return <Icon name="list-alt" />;
      case 'menu':
        return <Icon name="cutlery" />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground>
      <View style={styles.container}>
        <View style={styles.topBarButtons}>
          <TouchableOpacity style={styles.topBarButton} onPress={() => handleMenuPress('Menús')}>
            <Icon name="cutlery" size={20} color="#fff" />
            <Text style={styles.topBarButtonText}>Menús</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarButton} onPress={() => handleMenuPress('Carta')}>
            <Icon name="list-alt" size={20} color="#fff" /> 
            <Text style={styles.topBarButtonText}>Carta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarButton} onPress={() => handleMenuPress('Bebidas')}>
            <Icon name="glass" size={20} color="#fff" />
            <Text style={styles.topBarButtonText}>Bebidas</Text>
          </TouchableOpacity>
        </View>
        
       <View style={[styles.bottomBarButtons, styles.horizontalMargin]}>
          <TouchableOpacity style={styles.bottomBarButtonTerraza} onPress={handleTerrazaChange}>
            <Text style={styles.bottomBarButtonText}>Terraza</Text>
            <Switch value={terraza} onValueChange={handleTerrazaChange} />
          </TouchableOpacity>
          <TextInput
            style={styles.numComensaisInput}
            placeholder="Nº Comensais"
            keyboardType="numeric"
            value={numComensais}
            onChangeText={handleNumComensaisChange}
          />
         <TouchableOpacity
          style={[styles.bottomBarButton, { opacity: isCrearDisabled ? 0.5 : 1 }]}
          onPress={handleCrearMesa}
          disabled={isCrearDisabled}
        >
          <Text style={styles.bottomBarButtonText}> Crear </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSeleccionarMesa}>
          <Text style={styles.buttonText}>{obterTextoBoton()}</Text>
        </TouchableOpacity>
             <View style={styles.pedidoContainer}>
          <Text style={styles.pedidoTitle}>Pedido:</Text>
          <ScrollView>
            {pedido.map((item, index) => (
              <View key={index} style={styles.pedidoItem}>
                {getIconByType(item.type)}
                <Text>{item.name}</Text>
                <Text>{item.price} €</Text>
                <TouchableOpacity onPress={() => removeFromOrder(index)} style={styles.removeButton}>
                  <Text><Icon name="times" size={25} color="red" /></Text>
                </TouchableOpacity>
              </View>
            ))}
          {pedido.length > 0 && (
          <TouchableOpacity
            style={styles.confirmButtonVer}
            onPress={handleConfirmarPedido}
            disabled={pedido.length === 0}
          >
            <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
            <Icon name="check" size={20} color="green" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        )}
          </ScrollView>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <Text style={styles.gastadoText}>Gastado:{" "} {totalGastado.toFixed(2)} €</Text>
         <TouchableOpacity style={styles.clearButton} onPress={handleLimparApp}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
         {isPagarVisible && (
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handlePagar}
          >
            <Text style={styles.bottomButtonText}>Pagar</Text>
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
          numComensais={parseInt(numComensais)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
   horizontalMargin: {
    marginHorizontal: 10,
  },
  topBarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#007bff', 
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
  },
  topBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  topBarButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  bottomBarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    borderRadius: 10,
    backgroundColor: "white"
  },
   bottomBarButtonTerraza: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white"
  },
  bottomBarButtonText: {
    marginRight: 5,
  },
   bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
elevation: 5,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
 confirmButton: {
     backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  confirmButtonVer: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
elevation: 5,
    borderRadius: 10,
    alignItems: 'right',
    flexDirection: 'row',

  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },

  numComensaisInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
    clearButton: {
    paddingHorizontal: 20,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
      backgroundColor: "white",
      borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
elevation: 5,
  },
  gastadoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  button: {
borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
elevation: 5,
    marginHorizontal: 20,
    marginVertical: 3,
    borderColor: 'black',
    textAlign: 'center',
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
    centeredModal: {
    justifyContent: 'center',
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
 
  cancelButton: {
       elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
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
    padding: 5,
    borderRadius: 25,
    elevation: 2,
    backgroundColor: "white",
  },
});


