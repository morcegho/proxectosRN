import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Switch, TextInput, ImageBackground, StatusBar } from 'react-native';
import { obterMesas, crearMesa, actualizarMesa, eliminarMesa } from './DatabaseConnect';
import { carta, menus, bebidas } from './ListaAlimentos';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente para mostrar as mesas dispoñibles nun modal
function ModalMesasDisponibles({ visible, onClose, mesas, onSelectMesa, numComensais }) {
  // Filtrar as mesas dispoñibles segundo o número de comensais
  const mesasFiltradas = mesas.filter(mesa => mesa.capacidade >= numComensais);

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
                <Text style={styles.itemPrice}>Capacidade: {mesa.capacidade}</Text>
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

// Componente para mostrar a carta de bebidas nun modal
function ModalCartaBebidas({ visible, onClose, addToOrder, data, title }) {
  const [selectedItems, setSelectedItems] = useState([]);

  // Manexar a selección dun elemento
  const handleItemPress = (item) => {
    const updatedItems = selectedItems.includes(item) ? selectedItems.filter(selectedItem => selectedItem !== item) : [...selectedItems, item];
    setSelectedItems(updatedItems);
  };

  // Confirmar a selección de elementos e pechar o modal
  const handleConfirm = () => {
    addToOrder(selectedItems);
    onClose();
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2
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

// Componente principal da aplicación
export default function Menu() {
  // Estados do componente
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPantalla, setCurrentPantalla] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [terraza, setTerraza] = useState(false);
  const [numComensais, setNumComensais] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const isCrearDisabled = !terraza || isNaN(parseInt(numComensais)) || parseInt(numComensais) <= 0 || !mesaSeleccionada;
<<<<<<< HEAD
  const isPagarVisible = mesaSeleccionada && mesaSeleccionada.estado === 'servido';
=======
const isPagarVisible = mesaSeleccionada && mesaSeleccionada.estado === 'servido';
>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2

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

  // Consultar as mesas dispoñibles
  const consultarMesasDisponibles = async () => {
    try {
      const mesasLibres = await verificarDisponibilidadeMesas();

      // Devolver as mesas libres atopadas
      console.log('Mesas dispoñibles:', mesasLibres);
      return mesasLibres;
    } catch (error) {
      console.error('Erro ao consultar as mesas dispoñibles:', error);
      return [];
    }
  };

  // Verificar a dispoñibilidade das mesas
  const verificarDisponibilidadeMesas = async () => {
    try {
      // Lista de mesas buscadas
      const mesasBuscadas = [
        { id: 1, capacidade: 2 },
        { id: 2, capacidade: 3 },
        { id: 3, capacidade: 5 },
        { id: 4, capacidade: 6 },
        { id: 5, capacidade: 3, terraza: true },
        { id: 6, capacidade: 4, terraza: true },
        { id: 7, capacidade: 5, terraza: true },
      ];

      // Obter todas as mesas da base de datos
      const mesasDisponiveis = await obterMesas();

      // Verificar a dispoñibilidade de cada mesa buscada
      const mesasLibres = mesasBuscadas.filter(mesaBuscada => {
        const mesaEncontrada = mesasDisponiveis.find(mesa => mesa.id === mesaBuscada.id);
        // Se non está ocupada ou non se atopa na base de datos, está dispoñible
        return !mesaEncontrada || !mesaEncontrada.ocupada;
      });

      // Devolver as mesas libres atopadas
      return mesasLibres;
    } catch (erro) {
      console.error('Erro ao verificar a dispoñibilidade das mesas:', erro);
      return [];
<<<<<<< HEAD
      }
      };
      
      // Crear unha nova mesa
      const crearNovaMesa = async () => {
      try {
      const novaMesa = { id: mesasDisponibles.length + 1, capacidade: parseInt(numComensais), terraza: terraza, ocupada: false };
      await crearMesa(novaMesa);
      setMesasDisponibles([...mesasDisponibles, novaMesa]);
      console.log('Nova mesa creada:', novaMesa);
      } catch (error) {
      console.error('Erro ao crear unha nova mesa:', error);
      }
      };
      
      // Actualizar o estado dunha mesa
      const actualizarEstadoMesa = async () => {
      try {
      const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
      await actualizarMesa(mesaActualizada);
      setMesaSeleccionada(mesaActualizada);
      console.log('Estado da mesa actualizado:', mesaActualizada);
      } catch (error) {
      console.error('Erro ao actualizar o estado da mesa:', error);
      }
      };
      
      // Eliminar unha mesa
      const eliminarMesaSeleccionada = async () => {
      try {
      await eliminarMesa(mesaSeleccionada.id);
      setMesasDisponibles(mesasDisponibles.filter(mesa => mesa.id !== mesaSeleccionada.id));
      setMesaSeleccionada(null);
      console.log('Mesa eliminada:', mesaSeleccionada);
      } catch (error) {
      console.error('Erro ao eliminar a mesa seleccionada:', error);
      }
      };
      
      // Engadir elementos ao pedido
      const engadirAoPedido = (items) => {
      setPedido([...pedido, ...items]);
      const total = items.reduce((acc, item) => acc + item.price, 0);
      setTotalGastado(totalGastado + total);
      };
      
      // Restablecer o pedido e o total gastado
      const resetearPedido = () => {
      setPedido([]);
      setTotalGastado(0);
      };
      
      return (
      <View style={styles.container}>
      <StatusBar backgroundColor="#333" />
      <View style={styles.header}>
      <Text style={styles.headerText}>Restaurante</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.mesasButton}>
      <Text style={styles.buttonText}>Mesas</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.content}>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={() => setCurrentPantalla('carta')} style={styles.button}>
      <Text style={styles.buttonText}>Carta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentPantalla('pedidos')} style={styles.button}>
      <Text style={styles.buttonText}>Pedidos</Text>
      </TouchableOpacity>
      </View>
      {currentPantalla === 'carta' && (
      <ScrollView style={styles.cartaContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.mesasButton}>
      <Text style={styles.buttonText}>Selecionar Mesa</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.mesasButton}>
      <Text style={styles.buttonText}>Carta Bebidas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.mesasButton}>
      <Text style={styles.buttonText}>Carta Menús</Text>
      </TouchableOpacity>
      </ScrollView>
      )}
      {currentPantalla === 'pedidos' && (
      <ScrollView style={styles.pedidosContainer}>
      <Text style={styles.pedidoTitle}>Pedidos Realizados</Text>
      {pedido.map((item, index) => (
      <View key={index} style={styles.pedidoItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price} €</Text>
      </View>
      ))}
      <Text style={styles.totalText}>Total Gastado: {totalGastado} €</Text>
      <TouchableOpacity onPress={resetearPedido} style={styles.resetButton}>
      <Text style={styles.buttonText}>Resetear Pedido</Text>
      </TouchableOpacity>
      </ScrollView>
      )}
      </View>
      <ModalMesasDisponibles
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      mesas={mesasDisponibles}
      onSelectMesa={mesa => setMesaSeleccionada(mesa)}
      numComensais={parseInt(numComensais)}
      />
      <ModalCartaBebidas
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      addToOrder={engadirAoPedido}
      data={bebidas}
      title="Carta de Bebidas"
      />
      </View>
      );
      }
      const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  header: {
=======
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
  //     if (mesasDispoñibles.length > 0) {
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
    const nuevaMesa = await crearMesa({
      id: mesaSeleccionada ? mesaSeleccionada.id : null, // Si ya hay una mesa seleccionada, se usa su ID
      capacidad: parseInt(numComensais),
      terraza: terraza,
      ocupada: mesaSeleccionada ? mesaSeleccionada.ocupada : true, // Si ya hay una mesa seleccionada, se mantiene su estado de ocupación
      pagado: false,
      estado: 'reservada', // Se establece el estado como "reservada" al crear una nueva mesa
    });
    setMesaSeleccionada(nuevaMesa);
  } catch (error) {
    console.error('Error al crear la mesa:', error);
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
        console.log('No hay mesas disponibles.');
      }
    } else {
      const mesasDisponibles = await consultarMesasDisponibles();
      if (mesasDisponibles.length > 0) {
        setMesasDisponibles(mesasDisponibles);
        setModalVisible(true);
        // No se restablecen los valores de la mesa seleccionada si ya está creada
      } else {
        console.log('No hay mesas disponibles.');
      }
    }
  } catch (error) {
    console.error('Error al seleccionar la mesa:', error);
  }
};

const handleConfirmarPedido = async () => {
  try {
    if (mesaSeleccionada) {
      const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
      await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
      console.log('Estado de la mesa actualizado a "servido"');
    } else {
      alert('Debe seleccionar una mesa antes de confirmar el pedido');
    }
  } catch (error) {
    console.error('Error al confirmar el pedido:', error);
  }
};

const handlePagar = async () => {
  try {
    if (mesaSeleccionada) {
      const mesaActualizada = { ...mesaSeleccionada, pagado: true, ocupada: false, estado: 'libre' };
      await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
      console.log('Mesa marcada como "pagada" y "libre" con ocupada = false');
    } else {
      alert('Debe seleccionar una mesa antes de pagar');
    }
  } catch (error) {
    console.error('Error al pagar:', error);
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
// const handleLimparApp = async () => {
//   setCurrentPantalla(null); // Reinicia la pantalla actual
//   setPedido([]); // Reinicia el pedido
//   setTotalGastado(0); // Reinicia el total gastado
//   try {
//     // Si hay una mesa seleccionada, la eliminamos
//     if (mesaSeleccionada) {
//       await eliminarMesa(mesaSeleccionada.id); // Elimina la mesa seleccionada
//       console.log('Mesa eliminada:', mesaSeleccionada);
//     }
//     setMesaSeleccionada(null); // Reinicia la mesa seleccionada
//     setTerraza(false); // Reinicia el estado de terraza
//     setNumComensais(''); // Reinicia el número de comensales
//   } catch (error) {
//     console.error('Erro ao limpar a aplicación:', error);
//   }
// };


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
         <TouchableOpacity style={styles.clearButton} >
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
    marginHorizontal: 10, // Margen horizontal de 10
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
   // backgroundColor: '#f0f0f0',
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
>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
<<<<<<< HEAD
  },
  headerText: {
    color: '#fff',
=======
    paddingBottom: 20,
  },
  bottomButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 10,
      //backgroundColor: "white",
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
   // color: 'green',
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
>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2
    fontSize: 20,
    fontWeight: 'bold',
  },
  mesasButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
<<<<<<< HEAD
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cartaContainer: {
=======
 
  cancelButton: {
       elevation: 5,
    borderRadius: 10,
//    borderWidth: 1,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  pedidoContainer: {
>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2
    flex: 1,
    padding: 20,
  },
  pedidosContainer: {
    flex: 1,
    padding: 20,
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
<<<<<<< HEAD
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    fontWeight: 'bold',
    color: 'green',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});
=======
  removeButton: {
    padding: 5,
    borderRadius: 25,
    elevation: 2,
    backgroundColor: "white",
  },
});


>>>>>>> 815a26f88f9a2b4b80a25a614050324c8e78f2d2
