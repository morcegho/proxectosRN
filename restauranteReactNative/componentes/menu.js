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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#fff',
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
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cartaContainer: {
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