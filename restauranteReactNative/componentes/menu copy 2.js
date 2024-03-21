import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Switch, TextInput, ImageBackground } from 'react-native';
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
      <View style={styles.modalContainer}>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPantalla, setCurrentPantalla] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [terraza, setTerraza] = useState(false);
  const [numComensais, setNumComensais] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);

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

      // Verificar disponibilidade de cada mesa buscada
      const mesasLibres = mesasBuscadas.filter(mesaBuscada => {
        const mesaEncontrada = mesasDisponibles.find(mesa => mesa.id === mesaBuscada.id);
        // Se no está ocupada ou non se atopa na base de datos, está dispoñible
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

  const handleSeleccionarMesa = async () => {
    try {
      const mesasDispoñibles = await consultarMesasDisponibles();
      if (mesasDispoñibles.length > 0) {
        setMesasDisponibles(mesasDispoñibles);
        setModalVisible(true);
      } else {
        console.log('Non hai mesas dispoñibles.');
      }
    } catch (error) {
      console.error('Erro ao seleccionar a mesa:', error);
    }
  };

  const handleLimparApp = async () => {
    setCurrentPantalla(null);
    setPedido([]);
    setTotalGastado(0);
    setMesaSeleccionada(null);
    setTerraza(false);
    setNumComensais('');
    try {
      await eliminarMesa(mesaSeleccionada.id);
      console.log('Mesa eliminada:', mesaSeleccionada);
      setMesaSeleccionada(null);
      setNumComensais('');
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

  const handlePagar = async () => {
    try {
      if (mesaSeleccionada) {
        const mesaActualizada = { ...mesaSeleccionada, pagado: true, ocupada: false };
        await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
        console.log('Mesa marcada como "pagado" e "ocupada = false"');
      }
    } catch (error) {
      console.error('Erro ao pagar:', error);
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      if (mesaSeleccionada) {
        const mesaActualizada = { ...mesaSeleccionada, estado: 'servido' };
        await actualizarMesa(mesaSeleccionada.id, mesaActualizada);
        console.log('Estado da mesa actualizado a "servido"');
      }
    } catch (error) {
      console.error('Erro ao confirmar o pedido:', error);
    }
  };

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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Menús')}>
            <Icon name="cutlery" />
            <Text style={styles.buttonText}>Menús</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Carta')}>
            <Icon name="list-alt" /> 
            <Text style={styles.buttonText}>Carta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Bebidas')}>
            <Icon name="glass" />
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
            value={numComensais}
            onChangeText={handleNumComensaisChange}
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
          </ScrollView>
        </View>
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
          numComensais={parseInt(numComensais)}
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
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
