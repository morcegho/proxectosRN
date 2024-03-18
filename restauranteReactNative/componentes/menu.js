import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Image } from 'react-native';

// Componente para el contenido del modal de "Carta"
function ModalCarta({ visible, onClose, addToOrder }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const carta = [
    { id: 1, name: 'Plato 1', price: 5 },
    { id: 2, name: 'Plato 2', price: 8 },
    { id: 3, name: 'Plato 3', price: 12 },
    { id: 4, name: 'Plato 4', price: 10 },
    { id: 5, name: 'Plato 5', price: 15 },
    { id: 6, name: 'Plato 6', price: 9 },
    { id: 7, name: 'Plato 7', price: 11 },
    { id: 8, name: 'Plato 8', price: 7 },
    { id: 9, name: 'Plato 9', price: 6 },
    { id: 10, name: 'Plato 10', price: 13 },
  ];

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
        <Text style={styles.modalTitle}>Carta</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
            {carta.map((item) => (
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

// Componente para el contenido del modal de "Bebidas"
function ModalBebidas({ visible, onClose, addToOrder }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const bebidas = [
    { id: 1, name: 'Bebida 1', price: 2 },
    { id: 2, name: 'Bebida 2', price: 3 },
    { id: 3, name: 'Bebida 3', price: 4 },
    { id: 4, name: 'Bebida 4', price: 2.5 },
    { id: 5, name: 'Bebida 5', price: 3.5 },
    { id: 6, name: 'Bebida 6', price: 4.5 },
    { id: 7, name: 'Bebida 7', price: 2.25 },
    { id: 8, name: 'Bebida 8', price: 3.25 },
    { id: 9, name: 'Bebida 9', price: 4.25 },
    { id: 10, name: 'Bebida 10', price: 2.75 },
  ];

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
        <Text style={styles.modalTitle}>Bebidas</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
            {bebidas.map((item) => (
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

  const handlePedidoPress = () => {
    console.log("Ver Pedido");
    // Aquí puedes agregar la lógica para mostrar el pedido
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Menús')}>
          <Text style={styles.buttonText}>Menús</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Carta')}>
          <Text style={styles.buttonText}>Carta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Bebidas')}>
          <Text style={styles.buttonText}>Bebidas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pedidoContainer}>
        <Text style={styles.pedidoTitle}>Pedido:</Text>
        <ScrollView>
          {pedido.map((item, index) => (
            <View key={index} style={styles.pedidoItem}>
              <Text>{item.name}</Text>
              <Text>${item.price}</Text>
              <TouchableOpacity onPress={() => removeFromOrder(index)} style={styles.removeButton}>
                <Text>Quitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.topBar}>
        <Text style={styles.gastadoText}>Gastado: ${totalGastado.toFixed(2)}</Text>
        <TouchableOpacity style={styles.verPedidoButton} onPress={handlePedidoPress}>
          <Text style={styles.buttonText}>Ver Pedido</Text>
        </TouchableOpacity>
      </View>
      {currentPantalla === 'Carta' && (
        <ModalCarta visible={true} onClose={() => setCurrentPantalla(null)} addToOrder={addToOrder} />
      )}
      {currentPantalla === 'Bebidas' && (
        <ModalBebidas visible={true} onClose={() => setCurrentPantalla(null)} addToOrder={addToOrder} />
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
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
});



