import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {v4  as uuidv4}  from "uuid";

// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Creación de un cliente DynamoDB en la región "us-east-1"

export const handler = async(event) => {
   try{
    const videojuego = JSON.parse(event.body);
    
    // Analiza el cuerpo del evento y lo convierte en un objeto JSON

    const newVideojuego = { 
        ...videojuego,
        id: uuidv4(), 
        fechaIngreso: new Date().toLocaleDateString(),
    };

    const headers = {
        'Content-Type': 'aplication/json',
        'Access-Control-Allow-Origin': '*'
    };
    
    // Crea un nuevo objeto producto con un ID generado aleatoriamente y una fecha de ingreso actual

    await dynamo.send(new PutCommand({
        TableName: "VideojuegoTable",
        Item: newVideojuego,
    }));
    
    // Envía un comando de inserción (PutCommand) a la tabla "productos" de DynamoDB, con el nuevo objeto producto como dato a insertar

    return  { 
        statusCode: 201,
        headers: headers,
        body: JSON.stringify(newVideojuego)
    };
    
    // Devuelve una respuesta con un código de estado 201 (creado) y el nuevo producto como cuerpo de la respuesta en formato JSON

   } catch(error) {
    console.error(error);
    
    // Si ocurre un error durante el proceso, se muestra el mensaje de error en la consola

    return {
        statusCode: 500,
        body: JSON.stringify({message: error.message})
    };
    
    // Devuelve una respuesta con un código de estado 500 (error interno del servidor) y el mensaje de error como cuerpo de la respuesta en formato JSON
   }
};

