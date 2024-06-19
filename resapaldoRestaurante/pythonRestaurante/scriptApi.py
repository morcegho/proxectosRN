import requests

API_URL = 'http://192.168.8.100:3000/api/mesas'  # Cambiar IP se cambio de rede

# Obter todas as mesas
def obter_mesas():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  # Lanza  excepción en caso de erro na resposta
        return response.json()
    except requests.exceptions.RequestException as e:
        print('Erro ao obter as mesas:', e)

# Crea unha nova mesa
def crear_mesa(nueva_mesa):
    try:
        response = requests.post(API_URL, json=nueva_mesa)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print('Error al crear la mesa:', e)

# Actualizar unha mesa existente
def actualizar_mesa(id_mesa, datos_mesa):
    try:
        url = f'{API_URL}/{id_mesa}'
        response = requests.put(url, json=datos_mesa)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print('Error al actualizar la mesa:', e)

# Eliminar unha mesa existente
def eliminar_mesa(id_mesa):
    try:
        url = f'{API_URL}/{id_mesa}'
        response = requests.delete(url)
        response.raise_for_status()
        return {'message': 'Mesa eliminada correctamente'}
    except requests.exceptions.RequestException as e:
        print('Erro ao eliminar a mesa:', e)


#---------------------------------------------------------
# Exemplo de uso
if __name__ == '__main__':
    # Obtener todas las mesas
    mesas = obter_mesas()
    print('Mesas disponibles:', mesas)

    # Crear una nueva mesa
    nova_mesa = {'numero': 10, 'capacidad': 4, 'ocupada': False}
    mesa_creada = crear_mesa(nueva_mesa)
    print('Mesa creada:', mesa_creada)

    # Actualizar una mesa existente
    id_mesa_actualizar = 'id_da_mesa_que_actualizar'
    datos_actualizados = {'ocupada': True}
    mesa_actualizada = actualizar_mesa(id_mesa_actualizar, datos_actualizados)
    print('Mesa actualizada:', mesa_actualizada)

    # Eliminar unha mesa existente
    id_mesa_eliminar = 'id_de_la_mesa_a_eliminar'
    resultado_eliminacion = eliminar_mesa(id_mesa_eliminar)
    print('Resultado de eliminación:', resultado_eliminacion)
