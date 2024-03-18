import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Pantalla1Screen from './PrimeiraPantalla';
import Pantalla2Screen from './SegundaPantalla';
import Pantalla3Screen from './TerceiraPantalla';
import Pantalla4Screen from './CuartaPantalla';
import Pantalla5Screen from './QuintaPantalla';
import Menu from './menu';

export default function PrimeiraPantalla() {
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
    <View style={{ flex: 1 }}>
      {currentPantalla === null ? (
        // Si no se ha seleccionado un pantalla, muestra los botones del menú
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla1')}>
            <Text style={styles.buttonText}>Esta é a primeira pantalla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla2')}>
            <Text style={styles.buttonText}>Pantalla 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla3')}>
            <Text style={styles.buttonText}>Pantalla 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla4')}>
            <Text style={styles.buttonText}>Pantalla 4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla5')}>
            <Text style={styles.buttonText}>Pantalla 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Inicio')}>
            <Text style={styles.buttonText}>Menú Inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Si se ha seleccionado un pantalla, muestra la pantalla de ese pantalla
        renderPantallaScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    minWidth: "90%",
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
