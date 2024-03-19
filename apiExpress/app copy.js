const { MongoClient } = require('mongodb');

// Replace these placeholders with your actual MongoDB Atlas connection details
const uri = "mongodb+srv://mvilceb:noliu111@cluster0.iqwdukh.mongodb.net/?retryWrites=true&w=majority";
const dbName = "restaurante"; // Replace with the name of your database

async function connectToDb() {
  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");

    // Use the connected client to perform operations on your database (dbName)
    const db = client.db(dbName);

    // Example: Insert a document into a collection (replace "myCollection" with your desired collection name)
    const result = await db.collection("myCollection").insertOne({ name: "John Doe" });
    console.log("Document inserted:", result.insertedId);

    // Remember to close the connection after you're done
    await client.close();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the connectToDb function to initiate the connection
connectToDb();