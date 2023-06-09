import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {v4  as uuidv4}  from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const crearVideojuego = async(event) => {
   try{
    const videojuego = event.body;
    
    const newVideojuego = { 
        ...videojuego,
        id: uuidv4(), 
        fechaIngreso: new Date().toLocaleDateString(),
    };

    const headers = {
        'Content-Type': 'aplication/json',
        'Access-Control-Allow-Origin': '*'
    };
    

    await dynamo.send(new PutCommand({
        TableName: "VideojuegoTable",
        Item: newVideojuego,
    }));
    

    return  { 
        statusCode: 201,
        headers: headers,
        body: JSON.stringify(newVideojuego)
    };
    

   } catch(error) {
    console.error(error);    
       throw new createError.InternalServerError(error);
    }
};

export const handler = commonMiddleware(crearVideojuego);
