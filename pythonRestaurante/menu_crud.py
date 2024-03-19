import requests

API_URL = 'http://localhost:3000/api/mesas'  # Cambia o IP e o porto segundo a túa configuración

def obter_mesas():
    try:
        resposta = requests.get(API_URL)
        resposta.raise_for_status()
        return resposta.json()
    except requests.exceptions.RequestException as e:
        print('Erro ao obter as mesas:', e)

def crear_mesa():
    try:
        numero = int(input('Introduce o número da mesa: '))
        capacidade = int(input('Introduce a capacidade da mesa: '))
        ocupada = input('A mesa está ocupada? (True/False): ').lower() == 'true'  # Convertir a booleano
        cliente = input('Nome do cliente: ')
        pedidos = input('Pedidos (separados por comas): ').split(',')
        prezoTotal = float(input('Prezo total: '))
        pagado = input('¿O cliente xa pagou? (True/False): ').lower() == 'true'  # Convertir a booleano
        terraza = input('¿A mesa está na terraza? (True/False): ').lower() == 'true'  # Convertir a booleano
        numComensais = int(input('Número de comensais: '))
        estado = input('Estado da mesa (libre/reservada/ocupada): ')

        nova_mesa = {
            'id': numero,  # El campo 'id' debe coincidir con el campo definido en el esquema de Mongoose
            'capacidad': capacidade,
            'ocupada': ocupada,
            'cliente': cliente,
            'pedido': pedidos,  # Cambiar 'pedidos' a 'pedido' para que coincida con el campo definido en el esquema de Mongoose
            'prezoTotal': prezoTotal,
            'pagado': pagado,
            'terraza': terraza,
            'numComensais': numComensais,
            'estado': estado
        }

        resposta = requests.post(API_URL, json=nova_mesa)
        resposta.raise_for_status()
        print(f'Mesa {numero} creada con éxito.')
    except requests.exceptions.RequestException as e:
        print('Erro ao crear a mesa:', e)
    except ValueError:
        print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')

def cambiar_estado_mesa(id_mesa, estado):
    try:
        datos_actualizados = {'estado': estado}
        url = f'{API_URL}/{id_mesa}'
        resposta = requests.put(url, json=datos_actualizados)
        resposta.raise_for_status()
        print(f'Estado da mesa {id_mesa} actualizado a {estado}.')
    except requests.exceptions.RequestException as e:
        print('Erro ao cambiar o estado da mesa:', e)

def mostrar_menu():
    print('\n--- MENÚ ---')
    print('1. Crear mesa')
    print('2. Cambiar estado da mesa')
    print('3. Obter mesas')
    print('0. Saír')

def principal():
    while True:
        mostrar_menu()
        opcion = input('Selecciona unha opción: ')

        if opcion == '1':
            crear_mesa()
        elif opcion == '2':
            id_mesa = input('Introduce o ID da mesa: ')
            estado = input('Introduce o estado da mesa: ')
            cambiar_estado_mesa(id_mesa, estado)
        elif opcion == '3':
            mesas = obter_mesas()
            if mesas:
                print('Listado de mesas:')
                for mesa in mesas:
                    print(mesa)
            else:
                print('Non hai mesas dispoñibles.')
        elif opcion == '0':
            print('¡Ata logo!')
            break
        else:
            print('Opción non válida. Por favor, selecciona unha opción do menú.')

if __name__ == '__main__':
    principal()
