const { MongoClient } = require('mongodb');

// Cadena de conexión a tu clúster de MongoDB Atlas
const uri = 'mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority';

// Función para conectar a MongoDB Atlas
async function connectToDatabase() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Conexión establecida con MongoDB Atlas');
        return client.db('<database>'); // Cambia '<database>' por el nombre de tu base de datos
    } catch (error) {
        console.error('Error al conectar con MongoDB Atlas:', error);
        throw error;
    }
}

// Funciones para realizar operaciones CRUD
async function insertDocument(collectionName, document) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(document);
        console.log('Documento insertado con éxito:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('Error al insertar el documento:', error);
        throw error;
    }
}

// Más funciones CRUD...

module.exports = {
    connectToDatabase,
    insertDocument,
    // Exporta más funciones CRUD aquí...
};
