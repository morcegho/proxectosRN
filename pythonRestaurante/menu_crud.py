import requests  # Importa la biblioteca requests para as peticións HTTP 

# URL da API iniciar con py menu_crud.py
API_URL = 'http://localhost:3000/api/mesas'  #  IP e porta mudalo ao mudar d emáquina xunto con api exprees

# Lista de mesas físicas coa capacidade predeterminada
mesas_fisicas = [
    { 'numero': 1, 'capacidade': 2 },
    { 'numero': 2, 'capacidade': 3 },
    { 'numero': 3, 'capacidade': 5 },
    { 'numero': 4, 'capacidade': 6 },
    { 'numero': 5, 'capacidade': 3, 'terraza': True },
    { 'numero': 6, 'capacidade': 4, 'terraza': True },
    { 'numero': 7, 'capacidade': 5, 'terraza': True },
]

# Función para obter a lista de mesas desde o servidor
def obter_mesas():
    try:
        resposta = requests.get(API_URL)  # petición GET á URL de la API
        resposta.raise_for_status()  # Lanza excepción se a resposta ten un erro de estado HTTP
        return resposta.json()  # Devolve resposta en formato JSON
    except requests.exceptions.RequestException as e:  # Captura cualquera excepción durante a petición
        print('Erro ao obter as mesas:', e) 

# Función para converter a resposta s/n a booleano
def s_n_a_booleano(resposta):
    return resposta.lower() == 's'

def crear_mesa():
    try:
        # Solicita ao usuario os datos da nova mesa
        numero = int(input('Introduce o número da mesa: '))
        capacidade = next((mesa['capacidade'] for mesa in mesas_fisicas if mesa['numero'] == numero), None)
        if capacidade is None:
            print('Número de mesa inválido.')
            return
        
        ocupada = s_n_a_booleano(input('A mesa está ocupada? (s/n): '))
        cliente = input('Nome do cliente: ')
        
        # Pedidos
        pedidos_input = input('Pedidos (separados por comas): ').split(',')
        prezoTotal = float(input('Prezo total: '))
        pagado = s_n_a_booleano(input('O cliente xa pagou? (s/n): '))
        terraza = next((mesa.get('terraza', False) for mesa in mesas_fisicas if mesa['numero'] == numero), False)
        numComensais = int(input('Número de comensais: '))
        estado = input('Estado da mesa (libre/reservada/servida/pagada): ')

        # Crea un dicionario coas informacións da nova mesa
        nova_mesa = {
            'numero': numero,
            'capacidade': capacidade,
            'ocupada': ocupada,
            'cliente': cliente,
            'pedido': pedidos_input,
            'prezoTotal': prezoTotal,
            'pagado': pagado,
            'terraza': terraza,
            'numComensais': numComensais,
            'estado': estado
        }

        resposta = requests.post(API_URL, json=nova_mesa)  # Fai unha petición POST para crear a nova mesa
        resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
        print(f'Mesa {numero} creada con éxito.')  # Mensaxe de éxito
    except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
        print('Erro ao crear a mesa:', e)  # Imprime unha mensaxe de erro
    except ValueError:  # Captura excepcións se os datos introducidos son incorrectos
        print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')
# Función para crear unha nova mesa
def crear_mesa():
    try:
        # Solicita ao usuario os datos da nova mesa
        numero = int(input('Introduce o número da mesa: '))
        capacidade = next((mesa['capacidade'] for mesa in mesas_fisicas if mesa['numero'] == numero), None)
        if capacidade is None:
            print('Número de mesa inválido.')
            return
        
        ocupada = s_n_a_booleano(input('A mesa está ocupada? (s/n): '))
        cliente = input('Nome do cliente: ')
        
        # Pedidos
        pedidos_input = input('Pedidos (separados por comas): ').split(',')
        prezoTotal = float(input('Prezo total: '))
        pagado = s_n_a_booleano(input('O cliente xa pagou? (s/n): '))
        terraza = next((mesa.get('terraza', False) for mesa in mesas_fisicas if mesa['numero'] == numero), False)
        numComensais = int(input('Número de comensais: '))
        estado = input('Estado da mesa (libre/reservada/servida/pagada): ')

        # Crea un dicionario coas informacións da nova mesa
        nova_mesa = {
            'numero': numero,
            'capacidade': capacidade,
            'ocupada': ocupada,
            'cliente': cliente,
            'pedido': pedidos_input,
            'prezoTotal': prezoTotal,
            'pagado': pagado,
            'terraza': terraza,
            'numComensais': numComensais,
            'estado': estado
        }

        resposta = requests.post(API_URL, json=nova_mesa)  # Fai unha petición POST para crear a nova mesa
        resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
        print(f'Mesa {numero} creada con éxito.')  
    except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
        print('Erro ao crear a mesa:', e)  
    except ValueError:  # Captura excepcións se os datos introducidos son incorrectos
        print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')

# Función para cambiar el estado de una mesa
def cambiar_estado_mesa(id_mesa, estado, ocupada):
    try:
        datos_actualizados = {'estado': estado, 'ocupada': ocupada}  # Crea entrada dos datos para actualizar
        url = f'{API_URL}/{id_mesa}'  
        resposta = requests.put(url, json=datos_actualizados)  #  petición PUT para actualizar a mesa
        resposta.raise_for_status()  
        print(f'Estado da mesa {id_mesa} actualizado a {estado}, ocupada: {ocupada}.')  
    except requests.exceptions.RequestException as e:  
        print('Erro ao cambiar o estado da mesa:', e)  
#Pra eliminar mesa
def eliminar_mesa(id_mesa):
    try:
        url = f'{API_URL}/{id_mesa}'  
        resposta = requests.delete(url)  # petición DELETE para eliminar a mesa
        resposta.raise_for_status() 
        print(f'Mesa {id_mesa} eliminada con éxito.') 
    except requests.exceptions.RequestException as e:  # Captura cualquera excepción durante a petición
        print('Erro ao eliminar a mesa:', e)  

# Función para editar mesa punto por punto
def editar_mesa(id_mesa, mesa_actual):
    try:
        eliminar = input("Desexa eliminar esta mesa? (s/n): ").lower()
        if eliminar == 's':
            eliminar_mesa(id_mesa)
            return
        
        print("Editando mesa. Deixa en branco para manter o valor actual.")
        ocupada = input(f"A mesa está ocupada? (s/n) [{mesa_actual['ocupada']}]: ")
        cliente = input(f"Nome do cliente [{mesa_actual['cliente']}]: ")
        pedidos = input(f"Pedidos (separados por comas) [{','.join(mesa_actual['pedido'])}]: ")
        prezoTotal = input(f"Prezo total [{mesa_actual['prezoTotal']}]: ")
        pagado = input(f"O cliente xa pagou? (s/n) [{mesa_actual['pagado']}]: ")
        numComensais = input(f"Número de comensais [{mesa_actual['numComensais']}]: ")
        estado = input(f"Estado da mesa (libre/reservada/servida/pagada) [{mesa_actual['estado']}]: ")

        # Actualiza só campos que non deixaron en branco
        mesa_actualizada = {
            'ocupada': s_n_a_booleano(ocupada) if ocupada else mesa_actual['ocupada'],
            'cliente': cliente if cliente else mesa_actual['cliente'],
            'pedido': pedidos.split(',') if pedidos else mesa_actual['pedido'],
            'prezoTotal': float(prezoTotal) if prezoTotal else mesa_actual['prezoTotal'],
            'pagado': s_n_a_booleano(pagado) if pagado else mesa_actual['pagado'],
            'numComensais': int(numComensais) if numComensais else mesa_actual['numComensais'],
            'estado': estado if estado else mesa_actual['estado']
        }

        url = f'{API_URL}/{id_mesa}'  
        resposta = requests.put(url, json=mesa_actualizada)  #  PUT para actualizar a mesa
        resposta.raise_for_status()  # excepción de erro de estado HTTP
        print(f'Mesa {id_mesa} actualizada con éxito.')  
    except requests.exceptions.RequestException as e:  # Captura cualquera excepción durante a petición
        print('Erro ao editar a mesa:', e)  
    except ValueError:  # Captura excepcións se os datos introducidos son incorrectos
        print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')

# Función para seleccionar mesa dun listado
def seleccionar_mesa(mesas):
    mostrar_mesas(mesas)  
    seleccion = int(input("Selecciona o nº de mesa que queres editar: "))  
    if 1 <= seleccion <= len(mesas):  # Verifica que a selección é válida
        return mesas[seleccion - 1]  # Devolve a mesa seleccionada
    else:
        print("Selección inválida.")  #  erro se a selección non é válida
        return None  # Devolve None en caso de erro

# listado de mesas
def mostrar_mesas(mesas):
    print('Listado de mesas:') 
    for i, mesa in enumerate(mesas, 1):  # Itera sobre as mesas enumeradas
        capacidade = next((m['capacidade'] for m in mesas_fisicas if m['numero'] == mesa['numero']), 'Descoñecida')
        terraza = next((m.get('terraza', False) for m in mesas_fisicas if m['numero'] == mesa['numero']), False)
        terraza_str = ' (terraza)' if terraza else ''
        print(f'{i}. Mesa {mesa["numero"]} - Capacidade: {capacidade}{terraza_str} - Ocupada: {mesa["ocupada"]} - Cliente: {mesa["cliente"]} - Prezo Total: {mesa["prezoTotal"]} - Estado: {mesa["estado"]}')
    
# Función principal do menú
def menu():
    while True:  # Bucle principal
        print('1. Ver todas as mesas')
        print('2. Crear nova mesa')
        print('3. Editar mesa existente')
        print('4. Cambiar estado dunha mesa')
        print('5. Saír')

        try:
            opcion = input('Escolle unha opción: ')
        except KeyboardInterrupt:
            print('\nSaíndo...')
            break

        if opcion == '1':
            mesas = obter_mesas()
            if mesas:
                mostrar_mesas(mesas)
            else:
                print('Non hai mesas para mostrar.')
        elif opcion == '2':
            crear_mesa()
        elif opcion == '3':
            mesas = obter_mesas()
            if mesas:
                mesa = seleccionar_mesa(mesas)
                if mesa:
                    editar_mesa(mesa['_id'], mesa)
            else:
                print('Non hai mesas para editar.')
        elif opcion == '4':
            mesas = obter_mesas()
            if mesas:
                mesa = seleccionar_mesa(mesas)
                if mesa:
                    estado = input('Novo estado (libre/reservada/servida/pagada): ')
                    ocupada = s_n_a_booleano(input('A mesa está ocupada? (s/n): '))
                    cambiar_estado_mesa(mesa['_id'], estado, ocupada)
            else:
                print('Non hai mesas para cambiar o estado.')
        elif opcion == '5':
            print('Saíndo...')
            break
        else:
            print('Opción non válida, por favor escolle unha opción do 1 ao 5.')


# Executar o menú
if __name__ == '__main__':
    menu()
