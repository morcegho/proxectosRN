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
        ocupada = input('A mesa está ocupada? (True/False): ').lower() == 'true'  
        cliente = input('Nome do cliente: ')
        pedidos = input('Pedidos (separados por comas): ').split(',')
        prezoTotal = float(input('Prezo total: '))
        pagado = input('¿O cliente xa pagou? (True/False): ').lower() == 'true'  
        terraza = input('¿A mesa está na terraza? (True/False): ').lower() == 'true'  
        numComensais = int(input('Número de comensais: '))
        estado = input('Estado da mesa (libre/reservada/ocupada): ')

        nova_mesa = {
            'id': numero, 
            'capacidade': capacidade,
            'ocupada': ocupada,
            'cliente': cliente,
            'pedido': pedidos,  
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


# def mostrar_mesas(mesas):
#     print('Listado de mesas:')
#     for i, mesa in enumerate(mesas, 1):
#         print(f"{i}. Mesa {mesa['id']} plazas {mesa['capacidad']} estado: {mesa['estado']}")


# def cambiar_estado_mesa(id_mesa, estado):
#     try:
#         datos_actualizados = {'estado': estado}
#         url = f'{API_URL}/{id_mesa}'
#         resposta = requests.put(url, json=datos_actualizados)
#         resposta.raise_for_status()
#         print(f'Estado da mesa {id_mesa} actualizado a {estado}.')
#     except requests.exceptions.RequestException as e:
#         print('Erro ao cambiar o estado da mesa:', e)

def cambiar_estado_mesa(id_mesa, estado):
    try:
        datos_actualizados = {'estado': estado}
        url = f'{API_URL}/{id_mesa}'
        resposta = requests.put(url, json=datos_actualizados)
        resposta.raise_for_status()
        print(f'Estado da mesa {id_mesa} actualizado a {estado}.')
    except requests.exceptions.RequestException as e:
        print('Erro ao cambiar o estado da mesa:', e)
def seleccionar_mesa(mesas):
    mostrar_mesas(mesas)
    seleccion = int(input("Selecciona o nº de mesa que queres editar: "))
    if 1 <= seleccion <= len(mesas):
        id_mesa = mesas[seleccion - 1]['_id']
        return id_mesa
    else:
        print("Selección inválida.")
        return None
def mostrar_mesas(mesas):
    print('Listado de mesas:')
    for i, mesa in enumerate(mesas, 1):
        print(f"{i}. Mesa Nº: {mesa['id']} prazas {mesa['capacidad']} estado: {mesa['estado']}")

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
            mesas = obter_mesas()
            if mesas:
                id_mesa = seleccionar_mesa(mesas)
                if id_mesa:
                    estado = input('Introduce o novo estado da mesa: ')
                    cambiar_estado_mesa(id_mesa, estado)
            else:
                print('Non hai mesas dispoñibles.')
        elif opcion == '3':
            mesas = obter_mesas()
            if mesas:
                print('Listado de mesas:')
                for mesa in mesas:
                    print(mesa)
            else:
                print('Non hai mesas dispoñibles.')
        elif opcion == '0':
            print('Ata logo!')
            break
        else:
            print('Opción non válida. Por favor, selecciona unha opción do menú.')

if __name__ == '__main__':
    principal()
