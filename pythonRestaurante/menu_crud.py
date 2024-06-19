import requests  # Importa la biblioteca requests para as peticións HTTP 
# #   pip install nome_modulo
# # URL da API que apunta ao endpoint para interactuar coas mesas

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
# import requests  # Importa a biblioteca requests para facer peticións HTTP
# #   pip install nome_modulo
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
#         pagado = input('O cliente xa pagou? (True/False): ').lower() == 'true'  
#         terraza = input('A mesa está na terraza? (True/False): ').lower() == 'true'  
#         numComensais = int(input('Número de comensais: '))
#         estado = input('Estado da mesa (libre/reservada/servida): ')

#         # Crea un listado coas informacións da nova mesa
#         nova_mesa = {
#             'id': numero, 
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
# def cambiar_estado_mesa(id_mesa, estado):
#     try:
#         datos_actualizados = {'estado': estado}  # Crea un dicionario cos datos para actualizar
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
#         print(f"{i}. Mesa Nº: {mesa['id']} prazas {mesa['capacidad']} estado: {mesa['estado']}")  # Imprime cada mesa

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

# # import requests

# # API_URL = 'http://localhost:3000/api/mesas'  # Cambia o IP e o porto segundo a configuración

# # def obter_mesas():
# #     try:
# #         resposta = requests.get(API_URL)
# #         resposta.raise_for_status()
# #         return resposta.json()
# #     except requests.exceptions.RequestException as e:
# #         print('Erro ao obter as mesas:', e)

# # def crear_mesa():
# #     try:
# #         numero = int(input('Introduce o número da mesa: '))
# #         capacidade = int(input('Introduce a capacidade da mesa: '))
# #         ocupada = input('A mesa está ocupada? (True/False): ').lower() == 'true'  
# #         cliente = input('Nome do cliente: ')
# #         pedidos = input('Pedidos (separados por comas): ').split(',')
# #         prezoTotal = float(input('Prezo total: '))
# #         pagado = input('¿O cliente xa pagou? (True/False): ').lower() == 'true'  
# #         terraza = input('¿A mesa está na terraza? (True/False): ').lower() == 'true'  
# #         numComensais = int(input('Número de comensais: '))
# #         estado = input('Estado da mesa (libre/reservada/ocupada): ')

# #         nova_mesa = {
# #             'id': numero, 
# #             'capacidade': capacidade,
# #             'ocupada': ocupada,
# #             'cliente': cliente,
# #             'pedido': pedidos,  
# #             'prezoTotal': prezoTotal,
# #             'pagado': pagado,
# #             'terraza': terraza,
# #             'numComensais': numComensais,
# #             'estado': estado
# #         }

# #         resposta = requests.post(API_URL, json=nova_mesa)
# #         resposta.raise_for_status()
# #         print(f'Mesa {numero} creada con éxito.')
# #     except requests.exceptions.RequestException as e:
# #         print('Erro ao crear a mesa:', e)
# #     except ValueError:
# #         print('Erro ao introducir os datos. Por favor, asegúrate de ingresar os valores corretamente.')


# # # def mostrar_mesas(mesas):
# # #     print('Listado de mesas:')
# # #     for i, mesa in enumerate(mesas, 1):
# # #         print(f"{i}. Mesa {mesa['id']} plazas {mesa['capacidad']} estado: {mesa['estado']}")


# # # def cambiar_estado_mesa(id_mesa, estado):
# # #     try:
# # #         datos_actualizados = {'estado': estado}
# # #         url = f'{API_URL}/{id_mesa}'
# # #         resposta = requests.put(url, json=datos_actualizados)
# # #         resposta.raise_for_status()
# # #         print(f'Estado da mesa {id_mesa} actualizado a {estado}.')
# # #     except requests.exceptions.RequestException as e:
# # #         print('Erro ao cambiar o estado da mesa:', e)

# # def cambiar_estado_mesa(id_mesa, estado):
# #     try:
# #         datos_actualizados = {'estado': estado}
# #         url = f'{API_URL}/{id_mesa}'
# #         resposta = requests.put(url, json=datos_actualizados)
# #         resposta.raise_for_status()
# #         print(f'Estado da mesa {id_mesa} actualizado a {estado}.')
# #     except requests.exceptions.RequestException as e:
# #         print('Erro ao cambiar o estado da mesa:', e)
# # def seleccionar_mesa(mesas):
# #     mostrar_mesas(mesas)
# #     seleccion = int(input("Selecciona o nº de mesa que queres editar: "))
# #     if 1 <= seleccion <= len(mesas):
# #         id_mesa = mesas[seleccion - 1]['_id']
# #         return id_mesa
# #     else:
# #         print("Selección inválida.")
# #         return None
# # def mostrar_mesas(mesas):
# #     print('Listado de mesas:')
# #     for i, mesa in enumerate(mesas, 1):
# #         print(f"{i}. Mesa Nº: {mesa['id']} prazas {mesa['capacidad']} estado: {mesa['estado']}")

# # def mostrar_menu():
# #     print('\n--- MENÚ ---')
# #     print('1. Crear mesa')
# #     print('2. Cambiar estado da mesa')
# #     print('3. Obter mesas')
# #     print('0. Saír')

# # def principal():
# #     while True:
# #         mostrar_menu()
# #         opcion = input('Selecciona unha opción: ')

# #         if opcion == '1':
# #             crear_mesa()
# #         elif opcion == '2':
# #             mesas = obter_mesas()
# #             if mesas:
# #                 id_mesa = seleccionar_mesa(mesas)
# #                 if id_mesa:
# #                     estado = input('Introduce o novo estado da mesa: ')
# #                     cambiar_estado_mesa(id_mesa, estado)
# #             else:
# #                 print('Non hai mesas dispoñibles.')
# #         elif opcion == '3':
# #             mesas = obter_mesas()
# #             if mesas:
# #                 print('Listado de mesas:')
# #                 for mesa in mesas:
# #                     print(mesa)
# #             else:
# #                 print('Non hai mesas dispoñibles.')
# #         elif opcion == '0':
# #             print('Ata logo!')
# #             break
# #         else:
# #             print('Opción non válida. Por favor, selecciona unha opción do menú.')

# # if __name__ == '__main__':
# #     principal()
