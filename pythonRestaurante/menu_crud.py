import requests  # Importa a biblioteca requests para facer peticións HTTP

# URL da API que apunta ao endpoint para interactuar coas mesas
API_URL = 'http://localhost:3000/api/mesas'  # Cambia o IP e o porto segundo a configuración

# Función para obter a lista de mesas desde o servidor
def obter_mesas():
    try:
        resposta = requests.get(API_URL)  # Fai petición GET á URL da API
        resposta.raise_for_status()  # Mostra excepción se a resposta ten un erro de estado HTTP
        return resposta.json()  # Devolve a resposta en formato JSON
    except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
        print('Erro ao obter as mesas:', e)  # Imprime unha mensaxe de erro

# Función para converter a resposta s/n a booleano
def s_n_a_booleano(resposta):
    return resposta.lower() == 's'

# Función para crear unha nova mesa
def crear_mesa():
    try:
        # Solicita ao usuario os datos da nova mesa
        numero = int(input('Introduce o número da mesa: '))
        capacidade = int(input('Introduce a capacidade da mesa: '))
        ocupada = s_n_a_booleano(input('A mesa está ocupada? (s/n): '))
        cliente = input('Nome do cliente: ')
        pedidos = input('Pedidos (separados por comas): ').split(',')
        prezoTotal = float(input('Prezo total: '))
        pagado = s_n_a_booleano(input('¿O cliente xa pagou? (s/n): '))
        terraza = s_n_a_booleano(input('¿A mesa está na terraza? (s/n): '))
        numComensais = int(input('Número de comensais: '))
        estado = input('Estado da mesa (libre/reservada/servida/pagada): ')

        # Crea un dicionario coas informacións da nova mesa
        nova_mesa = {
            'numero': numero,
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

        resposta = requests.post(API_URL, json=nova_mesa)  # Fai unha petición POST para crear a nova mesa
        resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
        print(f'Mesa {numero} creada con éxito.')  # Mensaxe de éxito
    except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
        print('Erro ao crear a mesa:', e)  # Imprime unha mensaxe de erro
    except ValueError:  # Captura excepcións se os datos introducidos son incorrectos
        print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')

# Función para cambiar o estado dunha mesa
def cambiar_estado_mesa(id_mesa, estado, ocupada):
    try:
        datos_actualizados = {'estado': estado, 'ocupada': ocupada}  # Crea un dicionario cos datos a actualizar
        url = f'{API_URL}/{id_mesa}'  # Constrúe a URL específica para a mesa
        resposta = requests.put(url, json=datos_actualizados)  # Fai unha petición PUT para actualizar a mesa
        resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
        print(f'Estado da mesa {id_mesa} actualizado a {estado}, ocupada: {ocupada}.')  # Mensaxe de éxito
    except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
        print('Erro ao cambiar o estado da mesa:', e)  # Imprime unha mensaxe de erro

# Función para seleccionar unha mesa a partir dun listado
def seleccionar_mesa(mesas):
    mostrar_mesas(mesas)  # Mostra o listado de mesas
    seleccion = int(input("Selecciona o nº de mesa que queres editar: "))  # Solicita ao usuario a selección da mesa
    if 1 <= seleccion <= len(mesas):  # Verifica que a selección é válida
        id_mesa = mesas[seleccion - 1]['_id']  # Obtén o id da mesa seleccionada
        return id_mesa  # Devolve o id da mesa
    else:
        print("Selección inválida.")  # Mensaxe de erro se a selección non é válida
        return None  # Devolve None en caso de erro

# Función para mostrar o listado de mesas
def mostrar_mesas(mesas):
    print('Listado de mesas:')  # Título do listado
    for i, mesa in enumerate(mesas, 1):  # Itera sobre as mesas enumeradas
        print(f"{i}. Mesa Nº: {mesa['numero']} prazas {mesa['capacidade']} estado: {mesa['estado']} ocupada: {mesa['ocupada']}")  # Imprime cada mesa

# Función para mostrar o menú principal
def mostrar_menu():
    print('\n--- MENÚ ---')
    print('1. Crear mesa')
    print('2. Cambiar estado da mesa')
    print('3. Obter mesas')
    print('0. Saír')

# Función principal, controla o fluxo do programa
def principal():
    while True:  # Bucle infinito ata que se escolla a opción de saír
        mostrar_menu()
        opcion = input('Selecciona unha opción: ')

        if opcion == '1':
            crear_mesa()
        elif opcion == '2':
            mesas = obter_mesas()  # Obtén o listado de mesas
            if mesas:
                id_mesa = seleccionar_mesa(mesas)  # Solicita seleccionar unha mesa
                if id_mesa:
                    estado = input('Introduce o novo estado da mesa: ')  # Solicita o novo estado da mesa
                    ocupada_input = input('A mesa está ocupada? (s/n): ').lower()
                    ocupada = s_n_a_booleano(ocupada_input)
                    cambiar_estado_mesa(id_mesa, estado, ocupada)  # Chama á función para cambiar o estado da mesa
            else:
                print('Non hai mesas dispoñibles.')
        elif opcion == '3':
            mesas = obter_mesas()
            if mesas:
                print('Listado de mesas:')
                for mesa in mesas:
                    print(mesa)  # Imprime cada mesa
            else:
                print('Non hai mesas dispoñibles.')
        elif opcion == '0':
            print('Ata logo!')
            break  # Rompe o bucle e remata o programa
        else:
            print('Opción non válida. Por favor, selecciona unha opción do menú.')

# Executa a función principal se o ficheiro se executa directamente
if __name__ == '__main__':
    principal()



# import requests  # Importa a biblioteca requests para facer peticións =>  HTTP pip install requests

# import requests  # Importa a biblioteca requests para facer peticións HTTP

# # URL da API que apunta ao endpoint para interactuar coas mesas
# API_URL = 'http://localhost:3000/api/mesas'  # Cambia o IP e o porto segundo a configuración

# # Función para obter a lista de mesas desde o servidor
# def obter_mesas():
#     try:
#         resposta = requests.get(API_URL)  # Fai petición GET á URL da API
#         resposta.raise_for_status()  # Mostra excepción se a resposta ten un erro de estado HTTP
#         return resposta.json()  # Devolve a resposta en formato JSON
#     except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
#         print('Erro ao obter as mesas:', e)  # Imprime unha mensaxe de erro

# # Función para crear unha nova mesa
# def crear_mesa():
#     try:
#         # Solicita ao usuario os datos da nova mesa
#         numero = int(input('Introduce o número da mesa: '))
#         capacidade = int(input('Introduce a capacidade da mesa: '))
#         ocupada = input('A mesa está ocupada? (True/False): ').lower() == 'true'  
#         cliente = input('Nome do cliente: ')
#         pedidos = input('Pedidos (separados por comas): ').split(',')
#         prezoTotal = float(input('Prezo total: '))
#         pagado = input('¿O cliente xa pagou? (True/False): ').lower() == 'true'  
#         terraza = input('¿A mesa está na terraza? (True/False): ').lower() == 'true'  
#         numComensais = int(input('Número de comensais: '))
#         estado = input('Estado da mesa (libre/reservada/ocupada): ')

#         # Crea un dicionario coas informacións da nova mesa
#         nova_mesa = {
#             'numero': numero, 
#             'capacidade': capacidade,
#             'ocupada': ocupada,
#             'cliente': cliente,
#             'pedido': pedidos,  
#             'prezoTotal': prezoTotal,
#             'pagado': pagado,
#             'terraza': terraza,
#             'numComensais': numComensais,
#             'estado': estado
#         }

#         resposta = requests.post(API_URL, json=nova_mesa)  # Fai unha petición POST para crear a nova mesa
#         resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
#         print(f'Mesa {numero} creada con éxito.')  # Mensaxe de éxito
#     except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
#         print('Erro ao crear a mesa:', e)  # Imprime unha mensaxe de erro
#     except ValueError:  # Captura excepcións se os datos introducidos son incorrectos
#         print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')

# # Función para cambiar o estado dunha mesa
# def cambiar_estado_mesa(id_mesa, estado, ocupada):
#     try:
#         datos_actualizados = {'estado': estado, 'ocupada': ocupada}  # Crea un dicionario cos datos a actualizar
#         url = f'{API_URL}/{id_mesa}'  # Constrúe a URL específica para a mesa
#         resposta = requests.put(url, json=datos_actualizados)  # Fai unha petición PUT para actualizar a mesa
#         resposta.raise_for_status()  # Lanza unha excepción se a resposta ten un erro de estado HTTP
#         print(f'Estado da mesa {id_mesa} actualizado a {estado}.')  # Mensaxe de éxito
#     except requests.exceptions.RequestException as e:  # Captura calquera excepción durante a petición
#         print('Erro ao cambiar o estado da mesa:', e)  # Imprime unha mensaxe de erro

# # Función para seleccionar unha mesa a partir dun listado
# def seleccionar_mesa(mesas):
#     mostrar_mesas(mesas)  # Mostra o listado de mesas
#     seleccion = int(input("Selecciona o nº de mesa que queres editar: "))  # Solicita ao usuario a selección da mesa
#     if 1 <= seleccion <= len(mesas):  # Verifica que a selección é válida
#         id_mesa = mesas[seleccion - 1]['_id']  # Obtén o id da mesa seleccionada
#         return id_mesa  # Devolve o id da mesa
#     else:
#         print("Selección inválida.")  # Mensaxe de erro se a selección non é válida
#         return None  # Devolve None en caso de erro

# # Función para mostrar o listado de mesas
# def mostrar_mesas(mesas):
#     print('Listado de mesas:')  # Título do listado
#     for i, mesa in enumerate(mesas, 1):  # Itera sobre as mesas enumeradas
#         print(f"{i}. Mesa Nº: {mesa['numero']} prazas {mesa['capacidade']} estado: {mesa['estado']} ocupada: {mesa['ocupada']}")  # Imprime cada mesa

# # Función para mostrar o menú principal
# def mostrar_menu():
#     print('\n--- MENÚ ---')
#     print('1. Crear mesa')
#     print('2. Cambiar estado da mesa')
#     print('3. Obter mesas')
#     print('0. Saír')

# # Función principal, controla o fluxo do programa
# def principal():
#     while True:  # Bucle infinito ata que se escolla a opción de saír
#         mostrar_menu() 
#         opcion = input('Selecciona unha opción: ')

#         if opcion == '1':
#             crear_mesa()
#         elif opcion == '2':
#             mesas = obter_mesas()  # Obtén o listado de mesas
#             if mesas:
#                 id_mesa = seleccionar_mesa(mesas)  # Solicita seleccionar unha mesa
#                 if id_mesa:
#                     estado = input('Introduce o novo estado da mesa: ')  # Solicita o novo estado da mesa
                    
#                     cambiar_estado_mesa(id_mesa, estado)  # Chama á función para cambiar o estado da mesa
#             else:
#                 print('Non hai mesas dispoñibles.')
#         elif opcion == '3':
#             mesas = obter_mesas()
#             if mesas:
#                 print('Listado de mesas:')
#                 for mesa in mesas:
#                     print(mesa)  # Imprime cada mesa
#             else:
#                 print('Non hai mesas dispoñibles.')
#         elif opcion == '0':
#             print('Ata logo!')
#             break  # Rompe o bucle e remata o programa
#         else:
#             print('Opción non válida. Por favor, selecciona unha opción do menú.')

# # Executa a función principal se o ficheiro se executa directamente
# if __name__ == '__main__':
#     principal()
