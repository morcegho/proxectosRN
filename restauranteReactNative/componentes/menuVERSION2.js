import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Pantalla1Screen from './PrimeiraPantalla';
import Pantalla2Screen from './SegundaPantalla';
import Pantalla3Screen from './TerceiraPantalla';
import Pantalla4Screen from './CuartaPantalla';
import Pantalla5Screen from './QuintaPantalla';

export default function Menu() {
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
    <View style={styles.container}>
      {currentPantalla === null ? (
        // Si no se ha seleccionado un pantalla, muestra los botones del menú
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleMenuPress('Pantalla1')}>
            <Text style={styles.buttonText}>Pantalla 1</Text>
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
            <Text style={styles.buttonText}>Xa estás no Menú Inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderPantallaScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end', // Alinea los elementos al final del contenedor
  },
  buttonContainer: {
    flexDirection: 'column', // Cambiado a column para orden vertical
    alignItems: 'center', // Centra los elementos horizontalmente
    paddingBottom: 20, // Espacio inferior para separar los botones del borde inferior de la pantalla
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    elevation: 5, // Esto añade un efecto de elevación para que parezcan botones de cristal
    marginVertical: 5, // Espacio vertical entre los botones
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


