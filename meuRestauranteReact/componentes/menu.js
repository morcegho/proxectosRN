//lçoxica: verificar dispoñibles, se existe algún obxecto no servidor no que o número de mesa (propiedade "numero") apareza como "ocupada": true significa que está ocupada neste momento, por tanto a mesa non está dispoñible.
// Se non existe no servidor ningún oxecto con ese número de mesa significa que está dispoñible. Finalmente, se todos os obxectos co número buscado no servidor teñen en "false" a propiedade "ocupada" significa que esa mesa finalizou todos os servezos e volve estar dispoñible.

import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Modal, ScrollView, Switch, TextInput, ImageBackground, StatusBar } from 'react-native';
import { obterMesas, crearMesa, actualizarMesa, eliminarMesa } from './DatabaseConnect';
import { carta, menus, bebidas } from './ListaAlimentos';
import Icon from 'react-native-vector-icons/FontAwesome';


function ModalMesasDisponibles({ visible, onClose, mesas, onSelectMesa, numComensais, terraza }) {
  const mesasFiltradas = mesas.filter(mesa => 
    mesa.capacidade >= numComensais && (!terraza || mesa.terraza)
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Mesas Dispoñibles</Text>
        <ScrollView>
          <View style={styles.gridContainer}>
            {mesasFiltradas.map((mesa, index) => (
              <TouchableOpacity
                key={mesa.numero}
                style={[styles.gridItem, styles.textContainer, index % 2 === 1 ]}
                onPress={() => {
                  onSelectMesa(mesa);
                  onClose();
                }}
              >
                <Text style={styles.itemName}>Mesa {mesa.numero}  {mesa.terraza && (<Icon name="umbrella" size={24} color="#fff"/>)}</Text>
                <Text style={styles.itemPrezo}>Capacidade: {mesa.capacidade}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={onClose} style={[styles.cancelButton, {width:'40%', marginLeft: '55%'}]}>
        <Text style={styles.buttonText}>Cancelar <Icon name="times" size={20} color="white" /></Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function ModalCartaBebidas({ visible, onClose, engadeAorde, data, title }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemPress = (item) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter(selectedItem => selectedItem !== item)
      : [...selectedItems, item];
    setSelectedItems(updatedItems);
  };

  const handleConfirm = () => {
    engadeAorde(selectedItems);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.modalContainer, styles.centeredModal]}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView height="80%">
            <View style={styles.gridContainer}>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.gridItem, selectedItems.includes(item) && styles.selectedItem]}
                  onPress={() => handleItemPress(item)}
                >
                  {item.image && (
                    <ImageBackground
                      source={item.image}
                      style={styles.itemImaxeBackground}
                      imageStyle={styles.imageStyle}
                    >
                      <View style={styles.textContainer}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrezo}>{item.price} €</Text>
                      </View>
                    </ImageBackground>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirmar <Icon name="check" size={20} color="green" /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar <Icon name="times" size={20} color="white" /></Text>
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
  const [mesaCreada, setMesaCreada] = useState(false);
  const [numComensais, setNumComensais] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const isCrearDisabled = isNaN(parseInt(numComensais)) || parseInt(numComensais) <= 0 || !mesaSeleccionada;
  const isPagarVisible = mesaSeleccionada && mesaSeleccionada.estado === 'servida';

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
      const mesasDisponibles = await verificarDisponibilidadMesas();
      console.log('Mesas dispoñibles:', mesasDisponibles);
      return mesasDisponibles;
    } catch (error) {
      console.error('Erro ao consultar as mesas dispoñibles:', error);
      return [];
    }
  };
  
  const verificarDisponibilidadMesas = async () => {
    try {
      // Obter todas as mesas da base de datos
      const mesasDisponibles = await obterMesas();
  
      // Lista de mesas buscadas
      const mesasBuscadas = [
        { numero: 1, capacidade: 2 },
        { numero: 2, capacidade: 3 },
        { numero: 3, capacidade: 5 },
        { numero: 4, capacidade: 6 },
        { numero: 5, capacidade: 3, terraza: true },
        { numero: 6, capacidade: 4, terraza: true },
        { numero: 7, capacidade: 5, terraza: true },
      ];
  
      // Verificar dispoñibilidade de cada mesa buscada
      const mesasLibres = mesasBuscadas.filter(mesaBuscada => {
        const mesaEncontrada = mesasDisponibles.find(mesa => mesa.numero === mesaBuscada.numero);
        // Se non está ocupada ou non se atopa na base de datos, está dispoñible
        return !mesaEncontrada || !mesaEncontrada.ocupada;
      });
      // Devolver as mesas libres encontradas
      return mesasLibres;
    } catch (error) {
      console.error('Erro ao verificar a dispoñibilidade das mesas:', error);
      return [];
    }
  };
  

  const handleMenuPress = (pantalla) => {
    setCurrentPantalla(pantalla);
  };


  const retiraDaOrde = (index) => {
    const removedItem = pedido[index];
    const novoPedido = pedido.filter((item, i) => i !== index);
    setPedido(novoPedido);
    setTotalGastado(totalGastado - removedItem.price);
  };
  const engadeAorde = (items) => {
    const novoPedido = [...pedido, ...(Array.isArray(items) ? items : [items])];
    setPedido(novoPedido);
    const totalPrezo = (Array.isArray(items) ? items : [items]).reduce((total, item) => total + item.price, 0);
    setTotalGastado(totalGastado + totalPrezo);
  };
 

  const handleTerrazaChange = (value) => {
    setTerraza(value);
    if (value) {
      engadeAorde({ id: 'terraza', name: 'Terraza', price: 1, type: 'servizo' });
    } else {
      const index = pedido.findIndex(item => item.id === 'terraza');
      if (index !== -1) {
        retiraDaOrde(index);
      }
    }
  };
  const handleCrearMesa = async () => {
    try {
      const novaMesa = await crearMesa({
        numero: mesaSeleccionada.numero,
        capacidade: parseInt(mesaSeleccionada.capacidade),
        numComensais: parseInt(numComensais),
        terraza: mesaSeleccionada.terraza,
        pedido: pedido,
        prezoTotal: totalGastado,
        ocupada: true, // Se hai unha mesa seleccionada, mantén estado de ocupación
        pagado: false,
        estado: 'reservada', // Establece estado como "reservada" 
      });
      setMesaSeleccionada(novaMesa);
      setMesaCreada(true),
      console.log('\n\n--------------------------------Mesa ocupada!------------------------------------\n\n');

    } catch (error) {
      console.error('Erro ao crear a mesa:', error);
    }
  };


  const handleSeleccionarMesa = async () => {
    try {
      const mesasDisponibles = await consultarMesasDisponibles();
      if (mesasDisponibles.length > 0) {
        setMesasDisponibles(mesasDisponibles); // Actualiza estado coas mesas dispoñibles
        setModalVisible(true);
      } else {
        console.log('Non hai mesas dispoñibles.');
      }
    } catch (error) {
      console.error('Erro ao seleccionar a mesa:', error);
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      if (mesaCreada) {
        let mesaActualizada = { ...mesaSeleccionada, estado: 'servida' };
        
        // Verificar se mesaSeleccionada._id é undefined
        if (!mesaSeleccionada._id) {
          // Xerar un nuevo ID
          const novoID = generarID();
          mesaActualizada = { ...mesaActualizada, _id: novoID };
          console.log('Nuevo ID generado:', novoID);
        }
        
        // Actualizar a mesa co ID correspondente
        await actualizarMesa(mesaActualizada._id, mesaActualizada);
        console.log('Estado da mesa actualizado a "servida"');
        console.log('ID da mesa:', mesaActualizada._id);
  
        // Actualizar o texto do botón ao confirmar o pedido
        const textoBoton = obterTextoBoton();
        console.log(textoBoton);
        setMesaSeleccionada(mesaActualizada);
        console.log(mesaActualizada);
      } else {
        alert('Debe seleccionar unha mesa antes de confirmar o pedido');
      }
    } catch (error) {
      console.error('Error ao confirmar o pedido:', error);
    }
  };
  
  // Función para generar un ID aleatorio
  const generarID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  const handlePagar = async () => {
    try {
      if (mesaSeleccionada) {
        const mesaActualizada = { ...mesaSeleccionada, pagado: true, prezoTotal: totalGastado, pedido: pedido, ocupada: false, estado: 'libre' };
        await actualizarMesa(mesaSeleccionada._id, mesaActualizada);
        console.log('Mesa marcada como "pagada" y "libre" con ocupada = false');
  
        // Limpar a pantalla e o estado
        setCurrentPantalla(null);
        setPedido([]);
        setTotalGastado(0);
        setMesaSeleccionada(null);
        setMesaCreada(false); // Asegura que mesaCreada se establece a false
        setTerraza(false);
        setNumComensais('');
      } else {
        alert('Debe seleccionar unha mesa antes de pagar');
      }
    } catch (error) {
      console.error('Erro ao pagar:', error);
    }
  };
  
  // const handlePagar = async () => {
  //   try {
  //     if (mesaSeleccionada) {
  //       const mesaActualizada = { ...mesaSeleccionada, pagado: true, prezoTotal: totalGastado, pedido: pedido, ocupada: false, estado: 'libre' };
  //       await actualizarMesa(mesaSeleccionada._id, mesaActualizada);
  //       console.log('Mesa marcada como "pagada" e "libre" con ocupada = false');

  //       // Limpar a pantalla sen borrar o obxecto do servidor
  //       setCurrentPantalla(null);
  //       setPedido([]);
  //       setTotalGastado(0);
  //       setMesaSeleccionada(null);
  //       setTerraza(false);
  //       setNumComensais('');
  //     } else {
  //       alert('Debe seleccionar unha mesa antes de pagar');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao pagar:', error);
  //   }
  // };

  const handleLimparApp = async () => {
    if (mesaSeleccionada && !mesaSeleccionada.pagado) {
      try {
        await eliminarMesa(mesaSeleccionada._id);
        console.log('Mesa eliminada:', mesaSeleccionada);
      } catch (error) {
        console.error('Erro ao eliminar a mesa:', error);
      }
    } else {
      console.log('A mesa xa foi pagada, non se eliminará.');
    }

    // Limpar o estado da app
        setCurrentPantalla(null);
        setPedido([]);
        setTotalGastado(0);
        setMesaSeleccionada(null);
        setMesaCreada(false); 
        setTerraza(false);
        setNumComensais('');
  };

  const duasCifrasSelector = /^(.{0,2})$/; // Expression para que non haxa cigras de máis de 2 caracteres


  const handleNumComensaisChange = (text) => {
    if (duasCifrasSelector.test(text)) {
      setNumComensais(text);
    }
    if (mesaSeleccionada) {
      const novosDatosMesa = { ...mesaSeleccionada, numComensais: parseInt(text) };
      actualizarMesa(mesaSeleccionada._id, novosDatosMesa);
    }
  };





  const obterTextoBoton = () => mesaSeleccionada ? `Mesa ${mesaSeleccionada.numero} - ${mesaSeleccionada.estado}` : 'Ver Dispoñibles';

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
          <TouchableOpacity style={styles.botonBarBotonTerraza} onPress={handleTerrazaChange}>
            <Text style={styles.botonBarBotonText}>Terraza <Icon name="umbrella" size={24} color="#000"/></Text>
            <Switch value={terraza} onValueChange={handleTerrazaChange} />
          </TouchableOpacity>
          <View flexDirection='row' marginHorizontal={50}>
            <Icon name='group'size={24} color="#000"/>
          <TextInput
            style={styles.numComensaisInput}
            placeholder="Nº"
            keyboardType="numeric"
            value={numComensais}
            onChangeText={handleNumComensaisChange}
          />
          </View>
          <TouchableOpacity
            style={[styles.botonBarBoton, { opacity: isCrearDisabled ? 0.5 : 1 }]}
            onPress={handleCrearMesa}
            disabled={isCrearDisabled}
          >
            <Text style={styles.botonBarBotonText}> Crear </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSeleccionarMesa}>
          <Text style={[styles.buttonText,{color: 'black', textAlign: 'center'}]}>{obterTextoBoton()}</Text>
        </TouchableOpacity>
        <View style={styles.pedidoContainer}>
          <Text style={styles.pedidoTitle}>Resumo do pedido:</Text>
          <ScrollView>
            {pedido.map((item, index) => (
              <View key={index} style={styles.pedidoItem}>
                {getIconByType(item.type)}
                <Text>{item.name}</Text>
                <Text>{item.price} €</Text>
                <TouchableOpacity onPress={() => retiraDaOrde(index)} style={styles.retirarBoton}>
                  <Text><Icon name="times" size={25} color="red" /></Text>
                </TouchableOpacity>
              </View>
            ))}
            {pedido.length > 0 && (
              <TouchableOpacity
                style={styles.confirmaBotonVer}
                onPress={handleConfirmarPedido}
                disabled={pedido.length === 0}
              >
                <Text style={styles.confirmaBotonText}>Confirmar Pedido</Text>
                <Icon name="check" size={20} color="green" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <Text style={styles.gastadoText}>Gasto:{" "} {totalGastado.toFixed(2)} €</Text>
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
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} engadeAorde={engadeAorde} data={carta} title="Carta" />
        )}
        {currentPantalla === 'Bebidas' && (
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} engadeAorde={engadeAorde} data={bebidas} title="Bebidas" />
        )}
        {currentPantalla === 'Menús' && (
          <ModalCartaBebidas visible={true} onClose={() => setCurrentPantalla(null)} engadeAorde={engadeAorde} data={menus} title="Menús" />
        )}

        <ModalMesasDisponibles
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          mesas={mesasDisponibles}
          onSelectMesa={(mesa) => {
            mesa.estado='seleccionada'
            setMesaSeleccionada(mesa); // Asigna a mesa seleccionada ao estado
            setModalVisible(false);
          }}
          numComensais={parseInt(numComensais)}
          terraza={terraza}

        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    maxWidth: '100%'
  },
  horizontalMargin: {
    marginHorizontal: 1,
    justifyContent: 'space-between'
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
    // justifyContent: 'space-around',
    maxWidth:'100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  botonBarBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    padding: 3,
    borderRadius: 500,
    borderWidth:1,
    backgroundColor: "white"
  },
  botonBarBotonTerraza: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white"
  },
  botonBarBotonText: {
    marginRight: 5,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    width:"90%",
    marginHorizontal: "5%",
    maxWidth: '90%'
  },
  bottomButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 5
  },
  bottomButtonText: {
    color: '#000',
    fontSize: 20,
    paddingHorizontal: 5,
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
  confirmaBotonVer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor:'lightgreen',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop:'2%',
    marginHorizontal:'10%',
    elevation: 5,
    borderRadius: 10,
justifyContent:'space-around',
    textAlign: 'center',
    flexDirection: 'row',

  },
  confirmaBotonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },

  numComensaisInput: {
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth:1,
    paddingHorizontal: 5,
    marginHorizontal: 3,
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  gastadoText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    // backgroundColor: '#DDDDDD',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',

    padding: 10,
    // borderWidth:1,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
  },
  selectedItem: {
    // backgroundColor: 'lightgreen',
    borderWidth: 2,
    borderColor:'green'
  },


  cancelButton: {
    // elevation: 5,
    borderRadius: 10,
    //    borderWidth: 1,
    // backgroundColor: "white",
        backgroundColor: '#F44336',

    paddingVertical: 15,
    paddingHorizontal: 30,

    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
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
  retirarBoton: {
    padding: 5,
    borderRadius: 25,
    elevation: 2,
    backgroundColor: "white",
  },
  itemImaxeBackground: {
  width: '100%',
  height: 100,
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  borderRadius: 10,
  overflow: 'hidden', // que a imaxe non sobrepase
},
imageStyle: {
  resizeMode: 'contain',
},
textContainer: {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: 5,
  borderRadius: 5,
},

  itemImaxe: {
    // width: 50,
    height: 200,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
  },
  itemPrezo: {
    fontSize: 14,
    color: 'white',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
  },
  buttonContainer: {
    marginHorizontal:'5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  buttonText: {
    // color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
