import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Pantalla1Screen from './PrimeiraPantalla';
import Pantalla2Screen from './SegundaPantalla';
import Pantalla3Screen from './TerceiraPantalla';
import Pantalla4Screen from './CuartaPantalla';
import Pantalla5Screen from './QuintaPantalla';

export default function Menu2() {
  const [currentPantalla, setCurrentPantalla] = React.useState(null);

  // Esta función maneja el evento cuando se presiona un botón en el menú
  const handleMenuPress = (pantalla) => {
    setCurrentPantalla(pantalla); // Actualiza el estado con el pantalla seleccionado
  };

  // Función auxiliar para renderizar la pantalla de pantalla correspondiente
  const renderPantallaScreen = () => {
    switch (currentPantalla) {
      case 'Pantalla1':
        return <Pantalla1Screen />;
      case 'Pantalla2':
        return <Pantalla2Screen />;
      case 'Pantalla3':
        return <Pantalla3Screen />;
      case 'Pantalla4':
        return <Pantalla4Screen />;
      case 'Pantalla5':
        return <Pantalla5Screen />;
      case 'Inicio':
        return <Menu />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {currentPantalla === null ? (
        // Si no se ha seleccionado un pantalla, muestra los botones del menú
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla1')}>
            <Text style={styles.buttonText}>Menús</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla2')}>
            <Text style={styles.buttonText}>Carta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla3')}>
            <Text style={styles.buttonText}>Bebidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla4')}>
            <Text style={styles.buttonText}>Confirmar pago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla5')}>
            <Text style={styles.buttonText}>Limpar pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Inicio')}>
            <Text style={styles.buttonText}>Finalizar mesa</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderPantallaScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    minWidth: '90%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
